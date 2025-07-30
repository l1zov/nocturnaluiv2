// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use std::path::PathBuf;
use tauri_plugin_store::StoreExt;

const SETTINGS_PATH: &str = ".settings.dat";

#[tauri::command]
fn save_settings(app: tauri::AppHandle, key: String, value: String) -> Result<(), String> {
    let mut store = app.store(PathBuf::from(SETTINGS_PATH)).map_err(|e| e.to_string())?;
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

use tauri::{Manager, State};
use std::sync::Mutex;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};
use reqwest::blocking::Client as BlockingClient;
use std::time::Duration;

const HOST: &str = "127.0.0.1";

struct ConnectionManager {
    client: BlockingClient,
    port: Option<u16>,
}

impl ConnectionManager {
    fn new() -> Self {
        Self {
            client: BlockingClient::builder()
                .timeout(Duration::from_secs(1))
                .build()
                .unwrap(),
            port: None,
        }
    }

    fn check_connection(&self, port: u16) -> bool {
        let url = format!("http://{}:{}/secret", HOST, port);
        match self.client.get(&url).send() {
            Ok(response) => {
                if let Ok(text) = response.text() {
                    return text == "0xdeadbeef";
                }
            }
            Err(_) => {}
        }
        false
    }

    fn connect(&mut self) -> bool {
                for port in 6969..=7069 {
            if self.check_connection(port) {
                self.port = Some(port);
                return true;
            }
        }
        false
    }

        fn send(&mut self, script: &str) -> Result<bool, String> {
                if self.port.is_none() && !self.connect() {
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
            {
                Ok(response) => {
                    if response.status().is_success() {
                        return Ok(true);
                    } else {
                        self.port = None; // reset port on failure
                        return Err(format!("Execution failed with status: {}.", response.status()));
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
fn execute_script_command(
    script: String,
    state: State<Mutex<ConnectionManager>>,
) -> Result<(), String> {
    let mut manager = state.lock().unwrap();
    match manager.send(&script) {
        Ok(true) => Ok(()),
        Ok(false) => Err("An unknown error occurred.".to_string()),
        Err(e) => Err(e),
    }
}

#[tauri::command]
fn check_connection_command(state: State<Mutex<ConnectionManager>>) -> bool {
    let mut manager = state.lock().unwrap();
    if manager.port.is_some() {
        return manager.check_connection(manager.port.unwrap());
    }
    manager.connect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .manage(Mutex::new(ConnectionManager::new()))
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(debug_assertions)]
            window.open_devtools();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, Some(16.0))
                .expect("failed to apply vibrancy");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            save_settings,
            load_settings,
            fetch_suggestions_command,
            execute_script_command,
            check_connection_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
