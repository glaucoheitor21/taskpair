#!/bin/bash
# Gera o APK release localmente (sem EAS), no Windows com Git Bash.
# Requisitos: Android SDK em $ANDROID_HOME, JDK 17+ (o do Android Studio serve)
# e CMake 3.31+ instalado pelo SDK Manager (o ninja do CMake 3.22 não aceita
# caminhos longos do Windows e quebra o build do codegen).
set -e
export JAVA_HOME="${JAVA_HOME:-/c/Program Files/Android/Android Studio/jbr}"
export PATH="$JAVA_HOME/bin:$PATH"
SDK="$(cygpath -m "${ANDROID_HOME:-C:\Android\SDK}")"
cd "$(dirname "$0")/.."
CI=1 npx expo prebuild -p android --no-install
printf 'sdk.dir=%s\ncmake.dir=%s/cmake/3.31.6\n' "$SDK" "$SDK" > android/local.properties
cd android
./gradlew assembleRelease --no-daemon -PreactNativeArchitectures=arm64-v8a,x86_64
echo "APK: android/app/build/outputs/apk/release/app-release.apk"
