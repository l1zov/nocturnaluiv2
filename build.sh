#!/bin/bash
set -e
echo "Checking for required dependencies..."

command_exists() {
    command -v "$1" &> /dev/null
}

for cmd in node npm rustc cargo; do
    if ! command_exists $cmd; then
        echo "$cmd is not installed. Please install it to continue."
        exit 1
    fi
done

echo "All required dependencies are present."

echo "Checking and installing required Rust targets for universal build..."
rustup target add aarch64-apple-darwin
rustup target add x86_64-apple-darwin
echo "Required Rust targets are configured."

echo "Installing frontend dependencies..."
npm install
echo "Frontend dependencies are up to date."

echo "Syncing project version..."
USE_CURRENT=true
VERSION_FLAGS=()
ARGS=("$@")
ARGC=${#ARGS[@]}
IDX=0
while [ $IDX -lt $ARGC ]; do
  arg="${ARGS[$IDX]}"
  case "$arg" in
    --lunar)
      USE_CURRENT=false
      ;;
    --patch)
      if [ $((IDX+1)) -lt $ARGC ]; then
        VERSION_FLAGS+=("--patch" "${ARGS[$((IDX+1))]}")
        IDX=$((IDX+1))
      fi
      ;;
    --patch=*)
      VERSION_FLAGS+=("$arg")
      ;;
  esac
  IDX=$((IDX+1))
done

if [ "$USE_CURRENT" = true ]; then
  VERSION_FLAGS+=("--use-current")
fi

node ./scripts/version.mjs "${VERSION_FLAGS[@]}"

echo "Building the universal application..."
# (cd src-tauri && cargo clean)
npm run tauri -- build --target universal-apple-darwin

if [ $? -ne 0 ]; then
  echo "Universal build failed."
  exit 1
fi

echo
echo "Build complete."

