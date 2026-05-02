# StatusMy - Release Build Guide

## Prerequisites

- Android Studio (latest)
- Java 17+
- Node.js 18+
- Android SDK (API 34+)

## Development Build

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Run dev server
npm run dev:all

# Build web assets
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

## Release Build Steps

### 1. Generate Signing Keystore (one-time)

```bash
keytool -genkey -v \
  -keystore statusmy-release.keystore \
  -alias statusmy \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Store the keystore file securely. **Never commit it to git.**

### 2. Configure Signing

Add to `android/local.properties` (gitignored):

```properties
STATUSMY_RELEASE_STORE_FILE=../statusmy-release.keystore
STATUSMY_RELEASE_STORE_PASSWORD=your_store_password
STATUSMY_RELEASE_KEY_ALIAS=statusmy
STATUSMY_RELEASE_KEY_PASSWORD=your_key_password
```

Or set as environment variables / gradle properties.

### 3. Build Release APK

```bash
# Build web assets
npm run build

# Sync to Android
npx cap sync android

# Build release APK
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### 4. Build Release AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

## Firebase Setup (Push Notifications)

1. Create a Firebase project at https://console.firebase.google.com
2. Add Android app with package name `com.statusmy.app`
3. Download `google-services.json`
4. Place it at `android/app/google-services.json`
5. See `android/app/google-services.json.template` for structure

## SSL Pinning

Update certificate pins in `android/app/src/main/res/xml/network_security_config.xml`:

```bash
# Generate pin hash for your domain
openssl s_client -connect api.statusmy.com:443 | \
  openssl x509 -pubkey -noout | \
  openssl pkey -pubin -outform der | \
  openssl dgst -sha256 -binary | \
  openssl enc -base64
```

## Deep Linking

The app handles these URL schemes:
- `statusmy://monitor/:id` - Open specific monitor
- `statusmy://incidents` - Open incidents page
- `statusmy://alerts` - Open alerts page
- `https://app.statusmy.com/*` - Universal links

## Version Management

Update version in:
1. `android/app/build.gradle` → `versionCode` and `versionName`
2. `package.json` → `version`
3. Set `VITE_APP_VERSION` in `.env` for auto-update checks
