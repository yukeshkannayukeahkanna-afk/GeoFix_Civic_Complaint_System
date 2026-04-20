# 📦 Building Native Mobile Apps - GeoFix

This guide explains how to build native Android and iOS apps from your GeoFix PWA using Capacitor.

## 🎯 Overview

GeoFix can be distributed in three ways:

1. **Progressive Web App (PWA)** - Install directly from browser (easiest)
2. **Android APK/AAB** - Publish to Google Play Store
3. **iOS IPA** - Publish to Apple App Store

This guide focuses on building native apps (#2 and #3).

---

## 🛠️ Prerequisites

### For All Platforms
- **Node.js** 16+ and npm installed
- **Git** installed
- **Code editor** (VS Code recommended)

### For Android Development
- **Android Studio** (latest version)
- **JDK 11** or newer
- **Android SDK** (API 22 or higher)
- **Gradle** (comes with Android Studio)

### For iOS Development (macOS only)
- **Xcode** 14+ (from Mac App Store)
- **CocoaPods** (`sudo gem install cocoapods`)
- **macOS** (iOS apps can only be built on Mac)
- **Apple Developer Account** ($99/year for App Store)

---

## 📋 Step-by-Step Guide

### Step 1: Install Dependencies

Open terminal in your project folder and run:

```bash
# Install Node.js dependencies
npm install

# Install Capacitor CLI globally (optional but helpful)
npm install -g @capacitor/cli
```

### Step 2: Initialize Capacitor (First Time Only)

```bash
# Initialize Capacitor
npm run capacitor:init

# This creates capacitor.config.json and sets up the project
```

---

## 🤖 Building for Android

### Setup Android Platform

1. **Add Android platform:**
```bash
npm run capacitor:add:android
```

This creates an `android` folder with a complete Android Studio project.

2. **Open Android Studio:**
```bash
npm run capacitor:open:android
```

### Configure Android App

1. **Update app details** in `android/app/src/main/AndroidManifest.xml`:
   - Set permissions (CAMERA, ACCESS_FINE_LOCATION, INTERNET)
   - Configure app name and package

2. **Update icons and splash screen:**
   - Place icons in `android/app/src/main/res/mipmap-*/`
   - Place splash screen in `android/app/src/main/res/drawable/`

3. **Update version** in `android/app/build.gradle`:
```gradle
defaultConfig {
    applicationId "com.geofix.app"
    minSdkVersion 22
    targetSdkVersion 33
    versionCode 1
    versionName "1.0.0"
}
```

### Build Android App

#### Development Build (for testing)

```bash
# Sync web assets to Android
npm run capacitor:sync

# Open in Android Studio
npm run capacitor:open:android

# In Android Studio:
# Build → Build Bundle(s) / APK(s) → Build APK(s)
```

The APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Production Build (for Play Store)

1. **Create a keystore** (one-time):
```bash
keytool -genkey -v -keystore geofix-release.keystore -alias geofix -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure signing** in `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../geofix-release.keystore')
            storePassword 'your-password'
            keyAlias 'geofix'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. **Build release APK:**
```bash
cd android
./gradlew assembleRelease

# Or build AAB (Android App Bundle) for Play Store:
./gradlew bundleRelease
```

Output:
- **APK:** `android/app/build/outputs/apk/release/app-release.apk`
- **AAB:** `android/app/build/outputs/bundle/release/app-release.aab`

### Deploy to Google Play Store

1. Create a developer account at [Google Play Console](https://play.google.com/console)
2. Create a new application
3. Upload the AAB file
4. Fill in app details, screenshots, and descriptions
5. Set up pricing and distribution
6. Submit for review

---

## 🍎 Building for iOS

**⚠️ Note: iOS builds require a Mac computer**

### Setup iOS Platform

1. **Add iOS platform:**
```bash
npm run capacitor:add:ios
```

This creates an `ios` folder with Xcode project.

2. **Install CocoaPods dependencies:**
```bash
cd ios/App
pod install
cd ../..
```

3. **Open Xcode:**
```bash
npm run capacitor:open:ios
```

### Configure iOS App

1. **In Xcode, update app settings:**
   - Select `App` target in project navigator
   - Update **Bundle Identifier**: `com.geofix.app`
   - Update **Version** and **Build** numbers
   - Select your **Team** (Apple Developer account)

2. **Configure permissions** in `ios/App/App/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>GeoFix needs camera access to capture photos of civic issues</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>GeoFix needs your location to verify complaint locations</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>GeoFix needs photo library access to save complaint images</string>
```

3. **Update app icons and splash screen:**
   - Use Xcode's asset catalog at `ios/App/App/Assets.xcassets/`
   - Add AppIcon and LaunchImage

### Build iOS App

#### Development Build (for testing on device)

1. Connect your iPhone/iPad via USB
2. In Xcode, select your device from the device menu
3. Click ▶️ **Run** button
4. The app will install and launch on your device

#### Production Build (for App Store)

1. **Archive the app:**
   - In Xcode: Product → Archive
   - Wait for archiving to complete

2. **Upload to App Store:**
   - Click **Distribute App** in the Organizer window
   - Select **App Store Connect**
   - Follow the prompts to upload

3. **Test with TestFlight:**
   - App appears in App Store Connect
   - Submit for TestFlight internal testing
   - Share with beta testers

### Deploy to Apple App Store

1. Create a developer account at [Apple Developer](https://developer.apple.com)
2. Create an App ID and provisioning profiles
3. Create app in [App Store Connect](https://appstoreconnect.apple.com)
4. Upload build via Xcode or Application Loader
5. Fill in app metadata and screenshots
6. Submit for review

---

## 🔄 Updating Your Apps

When you update your web app, sync changes to native apps:

```bash
# Update web assets in native projects
npm run capacitor:sync

# Or sync specific platforms
npx cap sync android
npx cap sync ios
```

Then rebuild and republish to app stores.

---

## 🧪 Testing

### Test on Real Devices

**Android:**
```bash
# Enable USB debugging on your Android device
# Connect via USB
# In Android Studio: Run → Run 'app'
```

**iOS:**
```bash
# Connect iPhone/iPad via USB
# In Xcode: Select device → Click Run
```

### Test on Emulators

**Android Emulator:**
```bash
# In Android Studio: Tools → AVD Manager
# Create and start virtual device
# Run app on emulator
```

**iOS Simulator:**
```bash
# In Xcode: Select simulator → Click Run
```

---

## 🐛 Troubleshooting

### Common Android Issues

**Build fails with "SDK location not found":**
```bash
# Create local.properties in android/ folder:
echo "sdk.dir=/path/to/Android/sdk" > android/local.properties
```

**Gradle build fails:**
```bash
# Clean and rebuild:
cd android
./gradlew clean
./gradlew build
```

**App crashes on startup:**
- Check AndroidManifest.xml permissions
- Check logcat for errors: `adb logcat`
- Verify Firebase config if using

### Common iOS Issues

**CocoaPods installation fails:**
```bash
cd ios/App
pod deintegrate
pod install
```

**Code signing errors:**
- In Xcode: Select project → Signing & Capabilities
- Check "Automatically manage signing"
- Select your team

**Build fails:**
- Clean build folder: Xcode → Product → Clean Build Folder
- Update CocoaPods: `pod update`

---

## 📱 App Store Guidelines

### Google Play Store Requirements

- ✅ Minimum SDK 21 (Android 5.0)
- ✅ Target latest SDK (33+)
- ✅ Privacy policy URL required
- ✅ App must use HTTPS
- ✅ Provide screenshots (phone + tablet)
- ✅ Feature graphic (1024x500px)
- ✅ App icon (512x512px)

### Apple App Store Requirements

- ✅ iOS 13.0 or higher
- ✅ App built with latest Xcode
- ✅ Privacy policy required
- ✅ Screenshots for all device sizes
- ✅ App icon (1024x1024px)
- ✅ TestFlight testing recommended
- ✅ Permissions clearly explained

---

## 💰 Publishing Costs

| Platform | Developer Fee | Renewal |
|----------|--------------|---------|
| Google Play | $25 one-time | None |
| Apple App Store | $99/year | Annual |
| Both | $124 first year | $99/year |

---

## 🎨 App Assets Checklist

### Icons Needed
- ✅ Android: 48, 72, 96, 144, 192, 512 px
- ✅ iOS: 180px (1024px for store)
- ✅ PWA: 72, 96, 128, 144, 152, 192, 384, 512 px

### Screenshots Needed
- ✅ Android phone: 16:9 ratio
- ✅ Android tablet: 16:9 ratio
- ✅ iPhone 6.7": 1290x2796 px
- ✅ iPhone 6.5": 1242x2688 px
- ✅ iPad Pro: 2048x2732 px

### Other Assets
- ✅ Feature graphic (Play Store): 1024x500 px
- ✅ Promotional video (optional)
- ✅ Privacy policy document
- ✅ App description (short & full)

---

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev                      # Start local server
npm run capacitor:sync          # Sync web changes to native

# Android
npm run capacitor:add:android   # Add Android platform
npm run capacitor:open:android  # Open in Android Studio
npm run android:build           # Build release APK

# iOS
npm run capacitor:add:ios       # Add iOS platform
npm run capacitor:open:ios      # Open in Xcode
npm run ios:build              # Build release IPA

# Maintenance
npx cap sync                    # Sync both platforms
npx cap update                  # Update Capacitor
```

---

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com)
- [iOS Developer Guide](https://developer.apple.com)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)

---

## 📞 Need Help?

**Capacitor Issues:**
- GitHub: https://github.com/ionic-team/capacitor/issues
- Forum: https://forum.ionicframework.com

**App Store Issues:**
- Play Store Support: https://support.google.com/googleplay/android-developer
- App Store Support: https://developer.apple.com/support/

---

**Good Luck Building Your App! 🎉**

*Last updated: February 2026*
