use serde::Deserialize;

const GITHUB_REPO: &str = "l1zov/nocturnaluiv2";
const CURRENT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(Debug, Deserialize)]
struct GitHubRelease {
    tag_name: String,
    html_url: String,
    name: String,
    prerelease: bool,
    draft: bool,
}

fn parse_version(version: &str) -> Option<(u32, u32, u32)> {
    let version = version.trim_start_matches('v');
    let parts: Vec<&str> = version.split('.').collect();
    if parts.len() != 3 {
        return None;
    }

    let year = parts[0].parse::<u32>().ok()?;
    let month = parts[1].parse::<u32>().ok()?;
    let patch = parts[2].parse::<u32>().ok()?;

    Some((year, month, patch))
}

fn is_newer_version(current: &str, remote: &str) -> bool {
    match (parse_version(current), parse_version(remote)) {
        (Some((cy, cm, cp)), Some((ry, rm, rp))) => (ry, rm, rp) > (cy, cm, cp),
        _ => false,
    }
}

fn show_update_dialog(release_name: &str, version: &str, url: &str) -> UpdateAction {
    let message = format!(
        "A new version of Nocturnal UI is available!\\n\\nNew version: {}\\nCurrent version: {}\\n\\nWould you like to view the release page?",
        release_name,
        CURRENT_VERSION
    );

    let script = format!(
        r#"display dialog "{}" with title "Update Available" buttons {{"Later", "Open Release Page"}} default button "Open Release Page" with icon note"#,
        message
    );

    let output = std::process::Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .output();

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            if stdout.contains("button returned:Open Release Page") {
                let _ = std::process::Command::new("open").arg(url).spawn();
                UpdateAction::Download
            } else {
                UpdateAction::Later
            }
        }
        Err(_) => UpdateAction::Error,
    }
}

#[derive(Debug)]
pub enum UpdateAction {
    Download,
    Later,
    Error,
}

#[derive(Debug)]
pub enum UpdateCheckResult {
    UpdateAvailable {
        version: String,
        url: String,
        name: String,
    },
    UpToDate,
    Error(String),
}

pub async fn check_for_updates() -> UpdateCheckResult {
    let client = match reqwest::Client::builder()
        .user_agent("NocturnalUI-Updater")
        .timeout(std::time::Duration::from_secs(10))
        .build()
    {
        Ok(c) => c,
        Err(e) => return UpdateCheckResult::Error(e.to_string()),
    };

    let url = format!(
        "https://api.github.com/repos/{}/releases/latest",
        GITHUB_REPO
    );

    let response = match client.get(&url).send().await {
        Ok(r) => r,
        Err(e) => return UpdateCheckResult::Error(e.to_string()),
    };

    if !response.status().is_success() {
        return UpdateCheckResult::Error(format!(
            "Github api error {}",
            response.status()
        ));
    }

    let release: GitHubRelease = match response.json().await {
        Ok(r) => r,
        Err(e) => return UpdateCheckResult::Error(e.to_string()),
    };

    if release.draft || release.prerelease {
        return UpdateCheckResult::UpToDate;
    }

    if is_newer_version(CURRENT_VERSION, &release.tag_name) {
        UpdateCheckResult::UpdateAvailable {
            version: release.tag_name,
            url: release.html_url,
            name: release.name,
        }
    } else {
        UpdateCheckResult::UpToDate
    }
}

pub async fn check_and_prompt_update() {
    match check_for_updates().await {
        UpdateCheckResult::UpdateAvailable {
            version,
            url,
            name,
        } => {
            show_update_dialog(&name, &version, &url);
        }
        UpdateCheckResult::UpToDate => {
        }
        UpdateCheckResult::Error(e) => {
            eprintln!("update failed with {}", e);
        }
    }
}

#[tauri::command]
pub async fn check_for_updates_command() -> Result<Option<(String, String)>, String> {
    match check_for_updates().await {
        UpdateCheckResult::UpdateAvailable {
            version,
            url,
            name: _,
        } => Ok(Some((version, url))),
        UpdateCheckResult::UpToDate => Ok(None),
        UpdateCheckResult::Error(e) => Err(e),
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn vers_parsing() {
//         assert_eq!(parse_version("2025.12.1"), Some((2025, 12, 1)));
//         assert_eq!(parse_version("v2025.12.1"), Some((2025, 12, 1)));
//         assert_eq!(parse_version("2024.1.0"), Some((2024, 1, 0)));
//     }

//     #[test]
//     fn vers_comparison() {
//         assert!(is_newer_version("2025.12.1", "2025.12.2"));
//         assert!(is_newer_version("2025.12.1", "2026.1.0"));
//         assert!(!is_newer_version("2025.12.1", "2025.12.1"));
//         assert!(!is_newer_version("2025.12.1", "2025.12.0"));
//         assert!(!is_newer_version("2025.12.1", "2024.12.1"));
//     }
// }
