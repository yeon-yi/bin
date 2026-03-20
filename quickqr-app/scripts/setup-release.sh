#!/bin/bash
# QuickQR - Release Build Setup Script
# Run this script on your local machine with Android SDK installed.

set -e

echo "=== QuickQR Release Build Setup ==="
echo ""

# 1. Check prerequisites
echo "[1/6] Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js is required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "ERROR: npm is required"; exit 1; }

if [ -z "$ANDROID_HOME" ]; then
    echo "WARNING: ANDROID_HOME not set. Android build may fail."
    echo "Set it with: export ANDROID_HOME=\$HOME/Android/Sdk"
fi

echo "Node: $(node -v)"
echo "npm: $(npm -v)"
echo ""

# 2. Install dependencies
echo "[2/6] Installing dependencies..."
npm install
echo ""

# 3. Build web assets
echo "[3/6] Building web assets..."
npm run build
echo ""

# 4. Sync to Android
echo "[4/6] Syncing to Android..."
npx cap sync android
echo ""

# 5. Generate keystore if not exists
KEYSTORE_PATH="quickqr-release.keystore"
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "[5/6] Generating release keystore..."
    echo "You will be prompted for keystore details."
    keytool -genkey -v \
        -keystore "$KEYSTORE_PATH" \
        -alias quickqr \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000
    echo ""
    echo "IMPORTANT: Back up $KEYSTORE_PATH securely!"
    echo "If you lose this file, you cannot update your app on Play Store."
else
    echo "[5/6] Keystore already exists, skipping..."
fi
echo ""

# 6. Instructions
echo "[6/6] Setup complete!"
echo ""
echo "=== Next Steps ==="
echo ""
echo "1. Update android/app/build.gradle:"
echo "   - Uncomment the signingConfigs section"
echo "   - Set KEYSTORE_PASSWORD and KEY_PASSWORD environment variables:"
echo "     export KEYSTORE_PASSWORD=your_password"
echo "     export KEY_PASSWORD=your_password"
echo ""
echo "2. Replace test AdMob IDs with real ones:"
echo "   - src/utils/constants.ts (ADMOB_BANNER_ID, ADMOB_INTERSTITIAL_ID)"
echo "   - src/hooks/useAds.ts (adId values)"
echo "   - android/app/src/main/AndroidManifest.xml (APPLICATION_ID)"
echo ""
echo "3. Build the release AAB:"
echo "   cd android && ./gradlew bundleRelease"
echo "   Output: android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "4. Upload to Play Console: https://play.google.com/console"
echo ""
echo "5. Required Play Store assets (in store-assets/ folder):"
echo "   - icon-512.png (512x512 app icon)"
echo "   - feature-graphic.png (1024x500 feature graphic)"
echo "   - Screenshots: take on real device or emulator"
echo ""
