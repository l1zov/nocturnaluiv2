// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

mod tabs;

use std::path::PathBuf;
use tauri::Emitter;
use tauri_plugin_store::StoreExt;

const SETTINGS_PATH: &str = ".settings.dat";

#[tauri::command]
fn save_settings(app: tauri::AppHandle, key: String, value: String) -> Result<(), String> {
    let store = app.store(PathBuf::from(SETTINGS_PATH)).map_err(|e| e.to_string())?;
    store.set(key, value);
    store.save().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_settings(app: tauri::AppHandle, key: String) -> Result<Option<String>, String> {
    let store = app.store(PathBuf::from(SETTINGS_PATH)).map_err(|e| e.to_string())?;
    Ok(store.get(key).and_then(|v| v.as_str().map(|s| s.to_string())))
}

#[tauri::command]
async fn fetch_suggestions_command() -> Result<serde_json::Value, String> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://www.comet-ui.fun/api/v1/suggestions")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!("suggestions request failed: {}", response.status()));
    }

    let suggestions = response
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(suggestions)
}

use tauri::Manager;
use tokio::sync::Mutex;
use tauri::async_runtime::spawn;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
use reqwest::Client;
use std::time::Duration;

const HOST: &str = "127.0.0.1";

struct ConnectionManager {
    client: Client,
    port: Option<u16>,
}

impl ConnectionManager {
    fn new() -> Self {
        Self {
            client: Client::builder()
                .timeout(Duration::from_secs(1))
                .build()
                .unwrap(),
            port: None,
        }
    }

    async fn check_connection(&self, port: u16) -> bool {
        let url = format!("http://{}:{}/secret", HOST, port);
        match self.client.get(&url).send().await {
            Ok(response) => {
                if let Ok(text) = response.text().await {
                    return text == "0xdeadbeef";
                }
            }
            Err(_) => {}
        }
        false
    }

    async fn connect(&mut self) -> bool {
        for port in 6969..=7069 {
            if self.check_connection(port).await {
                self.port = Some(port);
                return true;
            }
        }
        false
    }

        async fn send(&mut self, script: &str) -> Result<bool, String> {
            if self.port.is_none() && !self.connect().await {
                return Err("Connection failed: No service found on expected ports.".to_string());
            }

            if let Some(port) = self.port {
                let url = format!("http://{}:{}/execute", HOST, port);
                match self
                    .client
                    .post(&url)
                    .header("Content-Type", "text/plain")
                    .body(script.to_string())
                    .send()
                    .await
                {
                    Ok(response) => {
                        if response.status().is_success() {
                            return Ok(true);
                        } else {
                            self.port = None; // reset port on failure
                            return Err(format!(
                                "Execution failed with status: {}.",
                                response.status()
                            ));
                        }
                    }
                    Err(e) => {
                        self.port = None; // reset port on error
                        return Err(format!("Request failed: {}", e));
                    }
                }
            }
            Ok(false)
        }
}

#[tauri::command]
async fn execute_script_command(
    script: String,
    state: tauri::State<'_, tokio::sync::Mutex<ConnectionManager>>,
) -> Result<(), String> {
    let mut manager = state.lock().await;
    match manager.send(&script).await {
        Ok(true) => Ok(()),
        Ok(false) => Err("uhoh! unknown error.".to_string()),
        Err(e) => Err(e),
    }
}

#[derive(Clone, serde::Serialize)]
struct ConnectionStatusPayload {
    connected: bool,
}

#[tauri::command]
async fn check_connection_command(
    state: tauri::State<'_, tokio::sync::Mutex<ConnectionManager>>,
) -> Result<bool, String> {
    let mut manager = state.lock().await;
    if let Some(port) = manager.port {
        return Ok(manager.check_connection(port).await);
    }
    Ok(manager.connect().await)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .manage(Mutex::new(ConnectionManager::new()))
        .setup(|app| {
            app.manage(tabs::AppState::new(&app.handle()));
            let window = app.get_webview_window("main").unwrap();

            #[cfg(debug_assertions)]
            window.open_devtools();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, Some(16.0))
                .expect("failed to apply vibrancy");

            let app_handle = app.handle().clone();

            spawn(async move {
                let connection_manager_state = app_handle.state::<tokio::sync::Mutex<ConnectionManager>>();
                loop {
                    let is_connected = {
                        let mut manager = connection_manager_state.lock().await;
                        let connected = match manager.port {
                            Some(port) => manager.check_connection(port).await,
                            None => manager.connect().await,
                        };
                        if !connected {
                            manager.port = None;
                        }
                        connected
                    };

                    app_handle
                        .emit_to(
                            "main",
                            "connection-status-changed",
                            ConnectionStatusPayload { connected: is_connected },
                        )
                        .unwrap();

                    tokio::time::sleep(Duration::from_secs(2)).await;
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            save_settings,
            load_settings,
            fetch_suggestions_command,
            execute_script_command,
            check_connection_command,
            tabs::get_tabs,
            tabs::get_active_tab,
            tabs::add_tab,
            tabs::close_tab,
            tabs::set_active_tab,
            tabs::update_tab_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
