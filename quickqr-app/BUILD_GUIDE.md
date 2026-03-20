# QuickQR - 완전한 Play Store 출시 가이드

> 이 가이드를 순서대로 따르면 Play Store에 앱을 출시할 수 있습니다.

---

## 체크리스트

- [ ] 1단계: 로컬 환경 준비 (Android Studio + SDK)
- [ ] 2단계: Google Play 개발자 계정 등록 ($25)
- [ ] 3단계: AdMob 계정 생성 및 광고 ID 발급
- [ ] 4단계: Gmail 계정 준비 (개발자 연락처용)
- [ ] 5단계: 릴리스 빌드 생성
- [ ] 6단계: Play Store 에셋 준비 (스크린샷)
- [ ] 7단계: 개인정보처리방침 호스팅
- [ ] 8단계: Play Console에 앱 등록 및 제출

---

## 1단계: 로컬 환경 준비

### Android Studio 설치
1. https://developer.android.com/studio 에서 다운로드 및 설치
2. 설치 완료 후 SDK Manager (Settings → Languages & Frameworks → Android SDK) 에서:
   - **SDK Platforms**: Android 14 (API 34) 또는 15 (API 35) 체크
   - **SDK Tools**: Android SDK Build-Tools, Android SDK Platform-Tools 체크
   - Apply 클릭

### 환경 변수 설정
```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

터미널 재시작 후 확인:
```bash
adb --version   # 정상 출력되면 OK
```

### 프로젝트 클론 및 빌드 테스트
```bash
git clone <repository-url>
cd quickqr-app
npm install
npm run build
npx cap sync android
npx cap open android   # Android Studio에서 열림
```

Android Studio에서 에뮬레이터 또는 실기기로 Run 해서 정상 동작 확인.

---

## 2단계: Google Play 개발자 계정 등록

1. https://play.google.com/console 접속
2. Google 계정으로 로그인
3. **$25 일회성 등록비** 결제
4. 개발자 정보 입력 (이름, 이메일, 전화번호)
5. 신원 확인 완료 (신규 계정은 **2-7일** 소요)

> **중요**: 계정 등록을 먼저 시작하세요! 심사에 시간이 걸립니다.

---

## 3단계: AdMob 설정

### AdMob 계정 생성
1. https://admob.google.com 접속
2. Google 계정으로 로그인
3. 앱 추가: "QuickQR" (아직 출시 안 됨 선택)

### 광고 단위 생성
1. **배너 광고** 단위 생성 → 광고 단위 ID 메모 (ca-app-pub-XXXX/YYYY)
2. **전면 광고** 단위 생성 → 광고 단위 ID 메모 (ca-app-pub-XXXX/ZZZZ)
3. 앱 ID 메모 (ca-app-pub-XXXX~WWWW)

### 코드에 적용 (3곳 수정)

**파일 1: `src/utils/constants.ts`**
```typescript
export const ADMOB_BANNER_ID = 'ca-app-pub-여기에배너ID입력';
export const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-여기에전면광고ID입력';
```

**파일 2: `src/hooks/useAds.ts`**
```typescript
// showBanner 함수 내
adId: '여기에배너ID입력',
isTesting: false,  // false로 변경!

// maybeShowInterstitial 함수 내
adId: '여기에전면광고ID입력',
isTesting: false,  // false로 변경!
```

**파일 3: `android/app/src/main/AndroidManifest.xml`**
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-여기에앱ID입력"/>
```

---

## 4단계: 릴리스 키스토어 생성

```bash
cd quickqr-app
keytool -genkey -v \
  -keystore quickqr-release.keystore \
  -alias quickqr \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_PASSWORD \
  -keypass YOUR_PASSWORD \
  -dname "CN=Your Name, O=Your Company, L=Seoul, C=KR"
```

> **절대 잃어버리면 안 됩니다!** 클라우드에 백업하세요.
> 이 파일과 비밀번호를 분실하면 앱 업데이트가 불가능합니다.

### build.gradle에 서명 설정 활성화

`android/app/build.gradle`에서 주석 해제:
```groovy
signingConfigs {
    release {
        storeFile file('../../quickqr-release.keystore')
        storePassword System.getenv('KEYSTORE_PASSWORD') ?: 'YOUR_PASSWORD'
        keyAlias 'quickqr'
        keyPassword System.getenv('KEY_PASSWORD') ?: 'YOUR_PASSWORD'
    }
}

buildTypes {
    release {
        ...
        signingConfig signingConfigs.release  // 이 줄 주석 해제
    }
}
```

---

## 5단계: 릴리스 빌드

```bash
cd quickqr-app

# 1. 웹 빌드
npm run build

# 2. Android 동기화
npx cap sync android

# 3. AAB (Android App Bundle) 빌드
cd android
./gradlew bundleRelease

# 결과 파일 위치:
# android/app/build/outputs/bundle/release/app-release.aab
```

또는 Android Studio에서:
1. Build → Generate Signed Bundle / APK
2. Android App Bundle 선택
3. 키스토어 정보 입력
4. release 선택
5. Create 클릭

---

## 6단계: Play Store 에셋 준비

### 이미 준비된 에셋 (`store-assets/` 폴더)
- `icon-512.png` - Play Store 앱 아이콘 (512x512)
- `feature-graphic.png` - 피처 그래픽 (1024x500)
- `STORE_LISTING.md` - 앱 제목/설명/키워드

### 직접 준비해야 하는 것: 스크린샷
에뮬레이터 또는 실기기에서 캡처 (1080x1920 세로):

1. QR 생성 메인 화면 (URL 입력 상태)
2. WiFi QR 생성 화면
3. QR 스캔 카메라 화면
4. 스캔 결과 화면
5. 히스토리 목록
6. 커스텀 색상 QR 코드
7. 연락처(vCard) 입력 화면
8. 설정 화면

**스크린샷 캡처 방법:**
```bash
# 에뮬레이터에서 캡처
adb exec-out screencap -p > screenshot_01.png
```

---

## 7단계: 개인정보처리방침 호스팅

앱에 `public/privacy-policy.html` 파일이 포함되어 있습니다.
이 파일을 웹에서 접근 가능한 URL로 호스팅해야 합니다.

### 방법 A: GitHub Pages (무료, 추천)
1. GitHub 저장소 Settings → Pages → Source: main branch, /docs
2. `docs/` 폴더에 `privacy-policy.html` 복사
3. URL: `https://your-username.github.io/quickqr-app/privacy-policy.html`

### 방법 B: 자체 도메인
`privacy-policy.html`을 picktrend.kr 등 기존 서버에 업로드

### 방법 C: Google Sites (무료)
1. https://sites.google.com 에서 새 사이트 생성
2. privacy-policy.html 내용 붙여넣기
3. 게시

---

## 8단계: Play Console에 앱 등록

### 8-1. 앱 만들기
1. Play Console → "앱 만들기"
2. 앱 이름: `QuickQR - QR코드 생성기 & 스캐너`
3. 기본 언어: 한국어
4. 앱/게임: 앱
5. 무료/유료: 무료

### 8-2. 스토어 등록정보
`store-assets/STORE_LISTING.md` 내용을 참고하여 입력:
- 짧은 설명 (80자)
- 전체 설명 (4000자)
- 앱 아이콘, 피처 그래픽, 스크린샷 업로드

### 8-3. 콘텐츠 등급
IARC 설문 응답 (`STORE_LISTING.md`의 "콘텐츠 등급 설문 답변 가이드" 참고)

### 8-4. 앱 콘텐츠
- 개인정보처리방침 URL 입력
- 광고 포함: 예
- 대상 연령: 만 13세 이상

### 8-5. 앱 출시
1. 프로덕션 → "새 버전 만들기"
2. AAB 파일 업로드 (`app-release.aab`)
3. 출시 이름: "1.0.0"
4. 출시 노트 작성:
   ```
   QuickQR 첫 출시!
   - 7가지 유형 QR코드 생성 (URL, WiFi, 연락처 등)
   - 카메라 QR코드 스캔
   - 커스텀 QR 스타일 (색상 변경)
   - 생성/스캔 기록 관리
   - 한국어/영어 지원
   ```
5. "검토 시작" 클릭

### 검토 기간
- 첫 앱: **3-7일** (최대 14일)
- 업데이트: 보통 1-3일

---

## 업데이트 배포 시

1. `android/app/build.gradle`에서 `versionCode`와 `versionName` 증가
2. 코드 수정 후 `npm run build && npx cap sync android`
3. `cd android && ./gradlew bundleRelease`
4. Play Console에서 새 AAB 업로드

---

## 문제 해결

### 빌드 실패: "SDK location not found"
→ `android/local.properties`에 SDK 경로 추가:
```
sdk.dir=/Users/yourname/Android/Sdk
```

### 빌드 실패: "Keystore was tampered with"
→ 키스토어 비밀번호 확인, 환경변수 설정 확인

### AdMob 광고 안 나옴
→ AdMob 승인 후 24-48시간 걸릴 수 있음, 테스트 ID로 먼저 확인

### Play Store 거부됨
→ 흔한 이유:
- 개인정보처리방침 누락
- 스크린샷과 실제 앱 불일치
- 앱 크래시
- 기능이 너무 단순 (설명과 불일치)
