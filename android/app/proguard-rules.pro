# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ── Capacitor ───────────────────────────────────────────────
-keep class com.getcapacitor.** { *; }
-keep class com.statusmy.app.** { *; }
-dontwarn com.getcapacitor.**

# Keep Capacitor plugin classes
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep class * extends com.getcapacitor.Plugin { *; }

# ── WebView / JavaScript Interface ─────────────────────────
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ── Firebase / FCM ──────────────────────────────────────────
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# ── AndroidX ───────────────────────────────────────────────
-keep class androidx.** { *; }
-dontwarn androidx.**

# ── OkHttp (if used by plugins) ────────────────────────────
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }

# ── Keep source file and line numbers for crash reporting ──
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ── Remove logging in release ──────────────────────────────
-assumenosideeffects class android.util.Log {
    public static int v(...);
    public static int d(...);
    public static int i(...);
}
