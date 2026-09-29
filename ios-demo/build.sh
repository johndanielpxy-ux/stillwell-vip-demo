#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p build/Stillwell.app build/module-cache
SDK=$(xcrun --sdk iphonesimulator --show-sdk-path)
ARCH=$(uname -m)
xcrun swiftc -parse-as-library -sdk "$SDK" -target "$ARCH-apple-ios17.0-simulator" \
  -module-cache-path "$PWD/build/module-cache" -framework UIKit -framework WebKit \
  Stillwell.swift -o build/Stillwell.app/Stillwell
cp Info.plist mobile.css bridge.js build/Stillwell.app/
xcrun swift -module-cache-path "$PWD/build/module-cache" make-icon.swift "$PWD/build/Stillwell.app"
codesign --force --sign - build/Stillwell.app
echo "Built $PWD/build/Stillwell.app"
if [[ "${1:-}" == "--install" ]]; then
  DEVICE="${STILLWELL_SIMULATOR:-booted}"
  xcrun simctl install "$DEVICE" "$PWD/build/Stillwell.app"
  xcrun simctl launch "$DEVICE" sg.stillwell.pitchdemo
fi
