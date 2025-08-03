#!/bin/bash
cargo clean --manifest-path src-tauri/Cargo.toml

echo "Building the application..."
npm run tauri build

if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed."
  exit 1
fi
