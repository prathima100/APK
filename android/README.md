# Arohak MDM — Android APK Project

This folder (`/android`) contains a complete Android Studio project ready to build the **Arohak MDM Android APK** (`.apk`).

---

## 🚀 3 Ways to Build & Get Your APK

### Method 1: Using Android Studio (Recommended for Developers)
1. **Open the project in Android Studio**:
   - Launch **Android Studio**.
   - Select **Open** and choose the `android` folder inside this project.
   - Wait for Gradle sync to complete.
2. **Build the APK**:
   - In the top menu, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
   - Once compilation finishes, click the notification popup link **"locate"** to find your compiled APK file:
     ```
     android/app/build/outputs/apk/debug/app-debug.apk
     ```
3. **Run on Device or Emulator**:
   - Connect your Android phone with **USB Debugging** enabled.
   - Click the green **Run (▶)** button in Android Studio.

---

### Method 2: Command Line Build (Fastest with Gradle / JDK 17+)
Open your terminal in the `android` directory and run:

```bash
# On Linux / macOS
chmod +x gradlew
./gradlew assembleDebug

# On Windows
gradlew.bat assembleDebug
```

Your compiled APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

To install directly to a connected Android phone:
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

### Method 3: Instant Browser-Based APK Generation (No Tools Required)
If you don't have Android Studio or the Android SDK installed:

1. Open **[https://www.pwabuilder.com](https://www.pwabuilder.com)** in your web browser.
2. Paste your live app URL:
   ```
   https://ais-pre-cndku662esqeqlgzqiif46-941678104114.asia-southeast1.run.app
   ```
3. Click **Start**.
4. Click **Package for Android** → **Generate APK / Package**.
5. Download your signed, ready-to-install Android `.apk` or `.aab` package!

---

## 📦 What's Included in this Android Project
- **`AndroidManifest.xml`**: Pre-configured with enterprise MDM permissions, network security configs, and launcher activity.
- **`MainActivity.kt`**: High-performance hardware-accelerated Android WebView with Swipe-to-Refresh, DOM storage, and cookie persistence.
- **`ArohakDeviceAdminReceiver.kt`**: Native Android enterprise Device Admin Receiver for device lock, password enforcement, and wipe operations.
- **`build.gradle`**: Modern Android Gradle Plugin 8.2+ targeting Android 14 (API 34).
