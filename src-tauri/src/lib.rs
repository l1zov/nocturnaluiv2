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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, save_settings, load_settings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
