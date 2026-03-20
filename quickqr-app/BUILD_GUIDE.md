# QuickQR - Android APK 빌드 가이드

## 1. 사전 준비

### Android Studio 설치
1. https://developer.android.com/studio 에서 다운로드
2. 설치 후 SDK Manager에서 설치:
   - Android SDK Platform 34 (또는 35)
   - Android SDK Build-Tools 34.0.0
   - Android SDK Platform-Tools

### 환경 변수 설정
```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

## 2. 프로젝트 빌드

```bash
cd quickqr-app

# 웹 빌드
npm run build

# Android에 웹 에셋 동기화
npx cap sync android

# Android Studio에서 열기
npx cap open android
```

## 3. 릴리스 키스토어 생성

```bash
keytool -genkey -v -keystore quickqr-release.keystore \
  -alias quickqr -keyalg RSA -keysize 2048 -validity 10000
```

**중요: 키스토어 파일을 안전한 곳에 백업하세요. 분실 시 앱 업데이트 불가!**

## 4. 릴리스 APK/AAB 빌드

Android Studio에서:
1. Build → Generate Signed Bundle / APK
2. Android App Bundle (AAB) 선택
3. 키스토어 정보 입력
4. Release 빌드 타입 선택
5. Finish

또는 커맨드라인:
```bash
cd android
./gradlew bundleRelease
# 결과: android/app/build/outputs/bundle/release/app-release.aab
```

## 5. Play Store 출시

### 필요 항목
- Google Play 개발자 계정 ($25 일회성) - https://play.google.com/console
- 앱 아이콘: 512x512 PNG
- 스크린샷: 최소 2장 (1080x1920 세로)
- 피처 그래픽: 1024x500 PNG
- 개인정보처리방침 URL
- AAB 파일

### Play Console 앱 등록
1. 새 앱 만들기 → "QuickQR - QR코드 생성기 & 스캐너"
2. 카테고리: 도구
3. 콘텐츠 등급 설문 완료
4. 스토어 등록정보 작성
5. 출시 → 프로덕션 → AAB 업로드
6. 검토 제출 (3-7일 소요)

## 6. AdMob 설정 (출시 후)

1. https://admob.google.com 에서 앱 등록
2. 광고 단위 ID 발급 (배너, 전면)
3. `src/utils/constants.ts`에서 테스트 ID를 실제 ID로 교체
4. `android/app/src/main/AndroidManifest.xml`에 AdMob APP_ID 추가:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXX~YYYYYYYY"/>
```
5. 재빌드 후 업데이트 출시
