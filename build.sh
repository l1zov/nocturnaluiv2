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

echo "Building the application..."

echo "Building for Intel..."
npm run tauri -- build --target x86_64-apple-darwin

if [ $? -ne 0 ]; then
  echo "Intel build failed."
  exit 1
fi

echo "Building for Silicon..."
npm run tauri -- build --target aarch64-apple-darwin

if [ $? -ne 0 ]; then
  echo "Apple Silicon build failed."
  exit 1
fi

echo "Built."
