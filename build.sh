#!/bin/bash
echo "Checking for required dependencies..."

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install it to continue."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Npm is not installed. Please install it to continue."
    exit 1
fi

if ! command -v rustc &> /dev/null; then
    echo "Rust is not installed. Please install it to continue."
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "Cargo is not installed. Please install it to continue."
    exit 1
fi

echo "All required dependencies are present."
cargo clean --manifest-path src-tauri/Cargo.toml

echo "Building the application..."
npm run tauri build

if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed."
  exit 1
fi
