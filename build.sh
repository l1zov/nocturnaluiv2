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
echo "Building the universal application..."
(cd src-tauri && cargo clean)
npm run tauri -- build --target universal-apple-darwin

if [ $? -ne 0 ]; then
  echo "Universal build failed."
  exit 1
fi

echo
echo "Build complete."

