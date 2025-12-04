#!/bin/bash
REPO="l1zov/nocturnaluiv2"
SPECIFIC_VERSION=""
SILENT_MODE=false
AUTO_UPDATE_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --version)
            SPECIFIC_VERSION="$2"
            shift 2
            ;;
        --silent)
            SILENT_MODE=true
            shift
            ;;
        --auto-update)
            AUTO_UPDATE_MODE=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

run_privileged() {
    if [ "$AUTO_UPDATE_MODE" = true ]; then
        osascript -e "do shell script \"$1\" with administrator privileges" 2>/dev/null
    else
        sudo sh -c "$1"
    fi
}

log() {
    if [ "$SILENT_MODE" = false ]; then
        echo "$1"
    fi
}

log "Checking for required tools..."

if ! command -v jq &> /dev/null; then
    log "jq is not found."
    if ! command -v brew &> /dev/null; then
        log "Homebrew is not installed, which is needed to install jq automatically."
        log "Please install Homebrew first by following the instructions at https://brew.sh/"
        exit 1
    fi

    log "Installing jq..."
    brew install jq

    if [ $? -ne 0 ]; then
        log "Failed to install jq with Homebrew. Please run brew install jq."
        exit 1
    fi
fi

log "Required tools are present."

if [ -n "$SPECIFIC_VERSION" ]; then
    log "Getting release for version: $SPECIFIC_VERSION..."
    VERSION_TAG="$SPECIFIC_VERSION"
    LATEST_RELEASE_JSON=$(curl -s "https://api.github.com/repos/$REPO/releases/tags/$VERSION_TAG")
else
    log "Getting the latest release..."
    LATEST_RELEASE_JSON=$(curl -s "https://api.github.com/repos/$REPO/releases/latest")
    VERSION_TAG=$(echo "$LATEST_RELEASE_JSON" | jq -r '.tag_name')
fi

VERSION=${VERSION_TAG#v}

EXPECTED="Nocturnal.UI_${VERSION}_universal.dmg"
DMG_URL=$(echo "$LATEST_RELEASE_JSON" | jq -r --arg expected "$EXPECTED" '.assets[] | select(.name == $expected) | .browser_download_url' | head -n 1)

if [ -z "$DMG_URL" ] || [ "$DMG_URL" = "null" ]; then
  DMG_URL=$(echo "$LATEST_RELEASE_JSON" | jq -r '.assets[] | select(.name | test("^Nocturnal UI_.*_universal\\.dmg$")) | .browser_download_url' | head -n 1)
fi

if [ -z "$DMG_URL" ] || [ "$DMG_URL" = "null" ]; then
  DMG_URL=$(echo "$LATEST_RELEASE_JSON" | jq -r '.assets[] | select(.name | endswith(".dmg")) | .browser_download_url' | head -n 1)
fi

if [ -z "$DMG_URL" ] || [ "$DMG_URL" == "null" ]; then
    log "Could not find a .dmg file in the latest release."
    log "Contact @lzov on discord."
    exit 1
fi

DMG_NAME=$(echo "$LATEST_RELEASE_JSON" | jq -r --arg url "$DMG_URL" '.assets[] | select(.browser_download_url == $url) | .name' | head -n 1)
if [ -z "$DMG_NAME" ] || [ "$DMG_NAME" = "null" ]; then
  DMG_NAME=$(basename "$DMG_URL")
fi
DOWNLOAD_PATH="/tmp/$DMG_NAME"

log "Downloading the latest release: $DMG_NAME"
curl -sSL -o "$DOWNLOAD_PATH" "$DMG_URL"

if [ $? -ne 0 ]; then
    log "DMG file failed to download."
    exit 1
fi

if [ "$SILENT_MODE" = false ]; then
  if [[ "$VERSION" == dev-* ]]; then
    cat << "EOF"
  Bleh.
EOF
  else
    cat << "EOF"
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
█████████████████████████████████   ████████████████████████
███████████████████████████████████     ████████████████████
████████████████████████████████████       █████████████████
█████████████████████████████████████▒       ███████████████
██████████████████████████████████████         █████████████
███████████████████████████████████████         ████████████
████████████████████████████████████████         ███████████
████████████████████████████████████████          ██████████
████████████████████████████████████████           █████████
████████████████████████████████████████           █████████
████████████████████████████████████████            ████████
████████████████████████████████████████            ████████
███████████████████████████████████████             ████████
███████████████████████████████████████             ████████
██████████████████████████████████████              ████████
████████████████████████████████████               █████████
███████████████████████████████████                █████████
█████████████████████████████████                 ██████████
█████████  ███████████████████                   ███████████
██████████     ███████████                      ████████████
███████████░                                   █████████████
█████████████                                ███████████████
███████████████                            █████████████████
██████████████████                      ████████████████████
██████████████████████░            ░████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████
EOF
  fi
fi

log "Successfully downloaded Nocturnal UI version: $VERSION"
log ""

log "Mounting the disk image..."
HDIUTIL_OUTPUT=$(hdiutil attach "$DOWNLOAD_PATH" -nobrowse -quiet)

if [ $? -ne 0 ]; then
    log "DMG file failed to mount."
    log "$HDIUTIL_OUTPUT"
    rm "$DOWNLOAD_PATH"
    exit 1
fi

MOUNT_POINT=$(echo "$HDIUTIL_OUTPUT" | grep -o '/Volumes/.*' | head -n 1)

if [ -z "$MOUNT_POINT" ]; then
    log "DMG mounted, but could not find the mount point."
    hdiutil detach "$MOUNT_POINT" -force >/dev/null 2>&1
    rm "$DOWNLOAD_PATH"
    exit 1
fi

SOURCE_APP_PATH=$(find "$MOUNT_POINT" -name "*.app" -maxdepth 1)

if [ -z "$SOURCE_APP_PATH" ]; then
    log "Could not find the .app file inside the DMG."
    hdiutil detach "$MOUNT_POINT" -force
    rm "$DOWNLOAD_PATH"
    exit 1
fi

APP_NAME=$(basename "$SOURCE_APP_PATH")
DEST_APP_PATH="/Applications/$APP_NAME"

log "Installing $APP_NAME to /Applications..."

if [ -d "$DEST_APP_PATH" ]; then
    log "Removing existing version..."
    run_privileged "rm -rf '$DEST_APP_PATH'"
fi

run_privileged "cp -R '$SOURCE_APP_PATH' '/Applications/'"

if [ $? -ne 0 ]; then
    log "Failed to copy the application to the Applications folder."
    hdiutil detach "$MOUNT_POINT" -force
    rm "$DOWNLOAD_PATH"
    exit 1
fi

log "Removing quarantine attribute..."
run_privileged "xattr -d com.apple.quarantine '$DEST_APP_PATH'" 2>/dev/null || true

log "Cleaning up..."
hdiutil detach "$MOUNT_POINT" -force >/dev/null
rm "$DOWNLOAD_PATH"

log "Installation complete! You can find $APP_NAME in your Applications folder."
