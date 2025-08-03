#!/bin/bash
REPO="l1zov/nocturnaluiv2"

echo "Checking for required tools..."

if ! command -v jq &> /dev/null; then
    echo "jq is not found."
    if ! command -v brew &> /dev/null; then
        echo "Homebrew is not installed, which is needed to install jq automatically."
        echo "Please install Homebrew first by following the instructions at https://brew.sh/"
        exit 1
    fi

    echo "Installing jq..."
    brew install jq

    if [ $? -ne 0 ]; then
        echo "Failed to install jq with Homebrew. Please run brew install jq."
        exit 1
    fi
fi

echo "Required tools are present."

echo "Getting the latest release..."

LATEST_RELEASE_JSON=$(curl -s "https://api.github.com/repos/$REPO/releases/latest")
ARCH=$(uname -m)

if [ "$ARCH" = "arm64" ]; then
    DMG_URL=$(echo "$LATEST_RELEASE_JSON" | jq -r '.assets[] | select(.name | endswith("aarch64.dmg")) | .browser_download_url')
elif [ "$ARCH" = "x86_64" ]; then
    DMG_URL=$(echo "$LATEST_RELEASE_JSON" | jq -r '.assets[] | select(.name | endswith("x86_64.dmg")) | .browser_download_url')
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi
VERSION=$(echo "$LATEST_RELEASE_JSON" | jq -r '.tag_name')

if [ -z "$DMG_URL" ] || [ "$DMG_URL" == "null" ]; then
    echo "Could not find a .dmg file in the latest release."
    echo "Contact @lzov on discord."
    exit 1
fi

DMG_NAME=$(basename "$DMG_URL")
DOWNLOAD_PATH="/tmp/$DMG_NAME"

echo "Downloading the latest release: $DMG_NAME"
curl -sSL -o "$DOWNLOAD_PATH" "$DMG_URL"

if [ $? -ne 0 ]; then
    echo "DMG file failed to download."
    exit 1
fi

if [[ "$VERSION" == dev-* ]]; then
  cat << "EOF"

DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV
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
DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV DEV 
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

echo "Successfully downloaded Nocturnal UI version: $VERSION"
echo ""

echo "Mounting the disk image..."
HDIUTIL_OUTPUT=$(hdiutil attach "$DOWNLOAD_PATH")

if [ $? -ne 0 ]; then
    echo "DMG file failed to mount."
    echo "$HDIUTIL_OUTPUT"
    rm "$DOWNLOAD_PATH"
    exit 1
fi

MOUNT_POINT=$(echo "$HDIUTIL_OUTPUT" | grep -o '/Volumes/.*' | head -n 1)

if [ -z "$MOUNT_POINT" ]; then
    echo "DMG mounted, but could not find the mount point."
    hdiutil detach "$MOUNT_POINT" -force >/dev/null 2>&1
    rm "$DOWNLOAD_PATH"
    exit 1
fi

# Find the .app directory in the mounted volume
SOURCE_APP_PATH=$(find "$MOUNT_POINT" -name "*.app" -maxdepth 1)

if [ -z "$SOURCE_APP_PATH" ]; then
    echo "Could not find the .app file inside the DMG."
    hdiutil detach "$MOUNT_POINT" -force
    rm "$DOWNLOAD_PATH"
    exit 1
fi

APP_NAME=$(basename "$SOURCE_APP_PATH")
DEST_APP_PATH="/Applications/$APP_NAME"

echo "Installing $APP_NAME to /Applications..."

if [ -d "$DEST_APP_PATH" ]; then
    echo "Removing existing version..."
    sudo rm -rf "$DEST_APP_PATH"
fi

sudo cp -R "$SOURCE_APP_PATH" "/Applications/"

if [ $? -ne 0 ]; then
    echo "Failed to copy the application to the Applications folder."
    hdiutil detach "$MOUNT_POINT" -force
    rm "$DOWNLOAD_PATH"
    exit 1
fi

echo "Removing quarantine attribute..."
sudo xattr -d com.apple.quarantine "$DEST_APP_PATH" 2>/dev/null || true

echo "Cleaning up..."
hdiutil detach "$MOUNT_POINT" -force >/dev/null
rm "$DOWNLOAD_PATH"

echo "Installation complete! You can find $APP_NAME in your Applications folder."
