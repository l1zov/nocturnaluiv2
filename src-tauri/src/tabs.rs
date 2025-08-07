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

#[derive(Debug, Serialize, Deserialize)]
struct SerializableState {
    tabs: Vec<Tab>,
    active_tab_id: usize,
    next_tab_id: usize,
}

impl Default for SerializableState {
    fn default() -> Self {
        let initial_tab = Tab {
            id: 1,
            title: "Script 1".to_string(),
            content: "".to_string(),
        };
        Self {
            tabs: vec![initial_tab],
            active_tab_id: 1,
            next_tab_id: 2,
        }
    }
}

pub struct AppState(Mutex<SerializableState>);

impl AppState {
    pub fn new(app_handle: &AppHandle) -> Self {
        if let Ok(store) = StoreBuilder::new(app_handle, PathBuf::from(TAB_STORE_PATH)).build() {
            if store.reload().is_ok() {
                if let Some(saved_state) = store.get(TAB_STATE_KEY) {
                    if let Ok(state) = serde_json::from_value::<SerializableState>(saved_state.clone()) {
                        if !state.tabs.is_empty() {
                            return Self(Mutex::new(state));
                        }
                    }
                }
            }
        }

        Self(Mutex::new(SerializableState::default()))
    }
}

fn save_state(state: &State<AppState>, app_handle: &AppHandle) -> Result<(), String> {
    let store = StoreBuilder::new(app_handle, PathBuf::from(TAB_STORE_PATH))
        .build()
        .map_err(|e| e.to_string())?;
    let state_guard = state.0.lock().map_err(|e| e.to_string())?;

    let json_state = serde_json::to_value(&*state_guard).map_err(|e| e.to_string())?;
    store.set(TAB_STATE_KEY.to_string(), json_state);
    store.save().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_tabs(state: State<AppState>) -> Result<Vec<Tab>, String> {
    let state_guard = state.0.lock().map_err(|e| e.to_string())?;
    Ok(state_guard.tabs.clone())
}

#[tauri::command]
pub fn get_active_tab(state: State<AppState>) -> Result<Tab, String> {
    let state_guard = state.0.lock().map_err(|e| e.to_string())?;
    state_guard
        .tabs
        .iter()
        .find(|t| t.id == state_guard.active_tab_id)
        .cloned()
        .ok_or_else(|| "active tab not found".to_string())
}

#[tauri::command]
pub fn add_tab(state: State<'_, AppState>, app_handle: AppHandle) -> Result<Tab, String> {
    let mut state_guard = state.0.lock().map_err(|e| e.to_string())?;
    let new_id = state_guard.next_tab_id;

    let new_tab = Tab {
        id: new_id,
        title: format!("Script {}", new_id),
        content: "".to_string(),
    };

    state_guard.tabs.push(new_tab.clone());
    state_guard.active_tab_id = new_id;
    state_guard.next_tab_id += 1;

    drop(state_guard);
    save_state(&state, &app_handle)?;

    Ok(new_tab)
}

#[tauri::command]
pub fn close_tab(
    state: State<'_, AppState>,
    id: usize,
    app_handle: AppHandle,
) -> Result<Vec<Tab>, String> {
    let mut state_guard = state.0.lock().map_err(|e| e.to_string())?;
    if state_guard.tabs.len() <= 1 {
        return Err("Cannot close the last tab.".to_string());
    }

    if let Some(index) = state_guard.tabs.iter().position(|t| t.id == id) {
        state_guard.tabs.remove(index);
        if state_guard.active_tab_id == id {
            state_guard.active_tab_id = if index < state_guard.tabs.len() {
                state_guard.tabs[index].id
            } else {
                state_guard.tabs.last().map_or(0, |t| t.id)
            };
        }
    }

    let cloned_tabs = state_guard.tabs.clone();
    drop(state_guard);
    save_state(&state, &app_handle)?;

    Ok(cloned_tabs)
}

#[tauri::command]
pub fn set_active_tab(
    state: State<'_, AppState>,
    id: usize,
    app_handle: AppHandle,
) -> Result<(), String> {
    let mut state_guard = state.0.lock().map_err(|e| e.to_string())?;
    if state_guard.tabs.iter().any(|t| t.id == id) {
        state_guard.active_tab_id = id;
        drop(state_guard);
        save_state(&state, &app_handle)?;
        Ok(())
    } else {
        Err("Tab not found.".to_string())
    }
}

#[tauri::command]
pub fn rename_tab(
    state: State<'_, AppState>,
    id: usize,
    new_title: String,
    app_handle: AppHandle,
) -> Result<(), String> {
    if new_title.chars().count() > 24 {
        return Err("Tab title cannot exceed 24 characters.".to_string());
    }

    let mut state_guard = state.0.lock().map_err(|e| e.to_string())?;
    if let Some(tab) = state_guard.tabs.iter_mut().find(|t| t.id == id) {
        tab.title = new_title;
        drop(state_guard);
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
    let mut state_guard = state.0.lock().map_err(|e| e.to_string())?;
    if let Some(tab) = state_guard.tabs.iter_mut().find(|t| t.id == id) {
        tab.content = content;
        drop(state_guard);
        save_state(&state, &app_handle)?;
        Ok(())
    } else {
        Err("Tab not found.".to_string())
    }
}
