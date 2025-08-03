use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, State};
use tauri_plugin_store::StoreBuilder;

const TAB_STORE_PATH: &str = ".tabs.dat";
const TAB_STATE_KEY: &str = "tabState";

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct Tab {
    pub id: usize,
    pub title: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize, Default)]
struct SerializableState {
    tabs: Vec<Tab>,
    active_tab_id: usize,
}

#[derive(Default)]
pub struct AppState {
    pub tabs: Mutex<Vec<Tab>>,
    pub active_tab_id: Mutex<usize>,
}

impl AppState {
    pub fn new(app_handle: &AppHandle) -> Self {
        if let Ok(store) = StoreBuilder::new(app_handle, PathBuf::from(TAB_STORE_PATH)).build() {
            if store.reload().is_ok() {
                if let Some(saved_state) = store.get(TAB_STATE_KEY) {
                    if let Ok(state) = serde_json::from_value::<SerializableState>(saved_state.clone()) {
                        if !state.tabs.is_empty() {
                            return Self {
                                tabs: Mutex::new(state.tabs),
                                active_tab_id: Mutex::new(state.active_tab_id),
                            };
                        }
                    }
                }
            }
        }

        let initial_tab = Tab {
            id: 1,
            title: "Script 1".to_string(),
            content: "".to_string(),
        };
        Self {
            tabs: Mutex::new(vec![initial_tab]),
            active_tab_id: Mutex::new(1),
        }
    }
}

fn save_state(state: &State<AppState>, app_handle: &AppHandle) -> Result<(), String> {
    if let Ok(store) = StoreBuilder::new(app_handle, PathBuf::from(TAB_STORE_PATH)).build() {
        let tabs = state.tabs.lock().unwrap();
        let active_tab_id = *state.active_tab_id.lock().unwrap();

        let serializable_state = SerializableState {
            tabs: tabs.clone(),
            active_tab_id,
        };

        let json_state = serde_json::to_value(&serializable_state).map_err(|e| e.to_string())?;
        store.set(TAB_STATE_KEY.to_string(), json_state);
        store.save().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub fn get_tabs(state: State<AppState>) -> Result<Vec<Tab>, String> {
    Ok(state.tabs.lock().unwrap().clone())
}

#[tauri::command]
pub fn get_active_tab(state: State<AppState>) -> Result<Tab, String> {
    let active_id = *state.active_tab_id.lock().unwrap();
    let tabs = state.tabs.lock().unwrap();
    if let Some(tab) = tabs.iter().find(|t| t.id == active_id) {
        Ok(tab.clone())
    } else if let Some(first_tab) = tabs.first() {
        *state.active_tab_id.lock().unwrap() = first_tab.id;
        Ok(first_tab.clone())
    } else {
        Err("No tabs available".to_string())
    }
}

#[tauri::command]
pub fn add_tab(state: State<'_, AppState>, app_handle: AppHandle) -> Result<Tab, String> {
    let mut tabs = state.tabs.lock().unwrap();
    let new_id = tabs.iter().map(|t| t.id).max().unwrap_or(0) + 1;

    let new_tab = Tab {
        id: new_id,
        title: format!("Script {}", new_id),
        content: "".to_string(),
    };

    tabs.push(new_tab.clone());
    *state.active_tab_id.lock().unwrap() = new_id;

    drop(tabs); // Unlock before calling save_state
    save_state(&state, &app_handle)?;

    Ok(new_tab)
}

#[tauri::command]
pub fn close_tab(
    state: State<'_, AppState>,
    id: usize,
    app_handle: AppHandle,
) -> Result<Vec<Tab>, String> {
    let mut tabs = state.tabs.lock().unwrap();
    if tabs.len() <= 1 {
        return Err("Cannot close the last tab.".to_string());
    }

    let mut active_tab_id = state.active_tab_id.lock().unwrap();
    if let Some(index) = tabs.iter().position(|t| t.id == id) {
        tabs.remove(index);
        if *active_tab_id == id {
            *active_tab_id = tabs.last().map_or(0, |t| t.id);
        }
    }
    let cloned_tabs = tabs.clone();
    drop(tabs);
    drop(active_tab_id);
    save_state(&state, &app_handle)?;

    Ok(cloned_tabs)
}

#[tauri::command]
pub fn set_active_tab(
    state: State<'_, AppState>,
    id: usize,
    app_handle: AppHandle,
) -> Result<(), String> {
    let tabs = state.tabs.lock().unwrap();
    if tabs.iter().any(|t| t.id == id) {
        *state.active_tab_id.lock().unwrap() = id;
        drop(tabs);
        save_state(&state, &app_handle)?;
        Ok(())
    } else {
        Err("Tab not found.".to_string())
    }
}

#[tauri::command]
pub fn update_tab_content(
    state: State<'_, AppState>,
    id: usize,
    content: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    let mut tabs = state.tabs.lock().unwrap();
    if let Some(tab) = tabs.iter_mut().find(|t| t.id == id) {
        tab.content = content;
        drop(tabs);
        save_state(&state, &app_handle)?;
        Ok(())
    } else {
        Err("Tab not found.".to_string())
    }
}
