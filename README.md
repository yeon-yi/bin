# 로빈팀 Q&A 시스템 개발 프로젝트

## 프로젝트 개요
(주)모집 플랫폼 브랜드 소속 로빈팀(로팀) 직원용 Q&A 랜딩페이지 개발.
도메인: picktrend.kr/robin
목적: 광고주 응대 CS 직원들이 빠르게 답변을 찾고 활용할 수 있는 시스템

## 기술 스택
- Backend: PHP 8.x, MySQL 8.0/MariaDB 10.6+
- Frontend: Vanilla CSS/JS (프레임워크 없이 고급 커스텀)
- 데이터: Git 업로드 MD 파일 파싱 + DB 저장
- 서버: picktrend.kr 기존 호스팅

## 코드 퀄리티 철학
세계적인 시니어 풀스택 개발자가 직접 작성한 것처럼 보여야 함. AI 생성 코드 특유의 패턴 절대 금지. 웹디자인 전문가가 감탄할 수준의 효율성과 우아함 필수.

### CSS 규칙
- BEM 네이밍: .block__element--modifier
- CSS 변수로 디자인 토큰 체계화
- DRY 원칙, 매직넘버 금지
- 논리적 속성 순서: position → display → box model → typography → visual → misc

### JS 규칙
- 즉시실행함수(IIFE) 또는 모듈 패턴으로 전역 오염 방지
- 이벤트 위임 적극 활용
- 디바운스 300ms, 스로틀 100ms 기본값
- 단일 책임 원칙, 함수당 20줄 이하 권장

### PHP 규칙
- PSR-12 코딩 스타일
- Prepared Statement 100%
- early return 패턴
- 함수당 단일 책임

### 주석 스타일
- Why 중심, What은 코드로 설명
- 섹션: /* ═══ Auth ═══ */
- TODO/FIXME 실무 마커 활용
- 파일 헤더: 목적 한 줄 설명만

### 금지 패턴
- "This function does X" 류 주석
- thisIsTheUserNameVariable 과잉 변수명
- 모든 줄 주석, 복붙 로직, console.log

## 디자인 시스템
### 컬러 토큰
```css
:root {
  --c-primary: #2563eb;
  --c-primary-hover: #1d4ed8;
  --c-bg: #ffffff;
  --c-bg-secondary: #f8fafc;
  --c-text: #1e293b;
  --c-text-muted: #64748b;
  --c-border: #e2e8f0;
  --c-success: #10b981;
  --c-warning: #f59e0b;
  --c-error: #ef4444;
}
[data-theme="dark"] {
  --c-bg: #0f172a;
  --c-bg-secondary: #1e293b;
  --c-text: #f1f5f9;
  --c-text-muted: #94a3b8;
  --c-border: #334155;
}
```

### 타이포그래피
- 브랜드 로고: "Robin" - Playfair Display 또는 Cormorant Garamond
- 본문: Pretendard (한글), Inter (영문)
- 코드: JetBrains Mono
- 스케일: 12/14/16/18/24/32/48px (1.25 비율)

### 간격 시스템
- 4px 기반: 4/8/12/16/24/32/48/64/96px
- 컴포넌트 내부: 12-16px
- 섹션 간격: 32-48px

### 반응형 브레이크포인트
- mobile: ~767px
- tablet: 768~1023px
- desktop: 1024px~
- max-width: 1280px (컨테이너)

### 애니메이션
- 기본 duration: 200ms
- easing: cubic-bezier(0.4, 0, 0.2, 1)
- 호버: scale(1.02), box-shadow 강화
- 페이지 전환: fade 150ms
- 모달: slideUp 250ms

### 그림자
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.07)
- lg: 0 10px 15px rgba(0,0,0,0.1)
- 다크모드: rgba(0,0,0,0.3) 기반

## 권한 체계
| 역할 | 권한 |
|------|------|
| admin | 전체 + 계정 생성 + 모니터링 + 설정 |
| user + can_write | 열람 + 반론집 작성 |
| user | 열람만 |

## 핵심 기능 명세
### Q&A 표시
- MD 파싱 → 카테고리별 카드 그리드
- 질문 클릭 → 슬라이드 다운 답변 표시
- 마크다운 렌더링: 볼드, 리스트, 코드블록 지원

### 검색
- 실시간 필터링 (300ms 디바운스)
- 자동완성 드롭다운 (최대 5개)
- 하이라이트: <mark> 태그로 매칭 텍스트 강조
- 검색 결과 없음 → 유사 키워드 추천

### 복사 기능
- 원클릭 복사 버튼
- 복사 성공 토스트 알림 (2초)
- 복사 시 마크다운 → 플레인텍스트 변환 옵션

### 북마크
- 하트/별 아이콘 토글
- 북마크 목록 별도 탭
- localStorage + DB 이중 저장 (오프라인 대응)

## 관리자 모니터링
### 실시간 로그
- 접속/조회/검색/복사/북마크 전체 기록
- 필터: 사용자별, 액션별, 기간별

### 대시보드 위젯
- 오늘 총 접속자 / 검색 수 / 복사 수
- 주간 활동 추이 라인 차트
- 인기 Q&A TOP 10 바 차트
- 활동 저조 팀원 알림

### 콘텐츠 갭 분석
- 검색되었으나 결과 없는 키워드 목록
- 빈도순 정렬 → 콘텐츠 추가 우선순위

## 사용자 경험 강화
### 키보드 단축키
- Ctrl/Cmd + K: 검색 포커스
- Ctrl/Cmd + B: 북마크 패널
- ESC: 모달/패널 닫기
- ↑↓: 검색 결과 탐색
- Enter: 선택

### 개인화
- 다크/라이트 모드 (시스템 연동 + 수동 토글)
- 폰트 크기: 14/16/18px 선택
- 카테고리 컬러 커스터마이징
- 마지막 스크롤 위치 복원

### 동기 부여
- 주간 활용왕 뱃지 (복사 횟수 기준)
- 연속 접속 스트릭 (불꽃 아이콘)
- 개인 통계: "이번 주 42회 검색, 18회 복사"
- 신규 Q&A 뱃지 (24시간 이내)

### 협업
- 피드백 버튼: 도움됨 👍 / 수정필요 🔧
- 수정 요청 시 관리자 알림
- 개선 제안 코멘트 (can_write 권한자)

## 보안 명세
### 인증
- 세션 기반, 쿠키 httpOnly + secure + sameSite
- 비활동 30분 자동 로그아웃
- 로그인 5회 실패 → 15분 IP 잠금
- 비밀번호: bcrypt cost 12, 최소 8자 영문+숫자

### 방어
- SQL Injection: PDO Prepared Statement
- XSS: htmlspecialchars(ENT_QUOTES, 'UTF-8')
- CSRF: 폼마다 토큰, 30분 만료
- 세션 고정: 로그인 시 session_regenerate_id(true)
- 클릭재킹: X-Frame-Options: DENY

### 접근 제어
- 모든 페이지 세션 체크 (login.php, install.php 제외)
- API 요청: 세션 + 권한 이중 검증
- 관리자 기능: role === 'admin' 서버사이드 검증

### 입력 검증
- 서버사이드 검증 필수 (클라이언트 검증은 UX용)
- 화이트리스트 기반 필터링
- 파일 업로드 금지 (MD는 Git으로만)

## 데이터베이스 스키마
### users
```sql
id INT PK AUTO_INCREMENT
username VARCHAR(50) UNIQUE NOT NULL
password VARCHAR(255) NOT NULL
name VARCHAR(100) NOT NULL
role ENUM('admin','user') DEFAULT 'user'
can_write TINYINT(1) DEFAULT 0
theme ENUM('light','dark','system') DEFAULT 'system'
font_size TINYINT DEFAULT 16
last_login DATETIME
login_attempts TINYINT DEFAULT 0
locked_until DATETIME
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### categories
```sql
id INT PK AUTO_INCREMENT
name VARCHAR(100) NOT NULL
slug VARCHAR(100) UNIQUE NOT NULL
color VARCHAR(7) DEFAULT '#2563eb'
sort_order INT DEFAULT 0
created_at TIMESTAMP
```

### qa_items
```sql
id INT PK AUTO_INCREMENT
category_id INT FK
question TEXT NOT NULL
answer LONGTEXT NOT NULL
keywords VARCHAR(500)
author_id INT FK
view_count INT DEFAULT 0
copy_count INT DEFAULT 0
is_pinned TINYINT(1) DEFAULT 0
source_file VARCHAR(255)
file_hash VARCHAR(64)
created_at TIMESTAMP
updated_at TIMESTAMP ON UPDATE
FULLTEXT INDEX ft_search (question, answer, keywords)
INDEX idx_category (category_id)
INDEX idx_pinned (is_pinned, sort_order)
```

### bookmarks
```sql
user_id INT
qa_id INT
created_at TIMESTAMP
PRIMARY KEY (user_id, qa_id)
```

### user_pins
```sql
user_id INT
qa_id INT
sort_order INT DEFAULT 0
PRIMARY KEY (user_id, qa_id)
```

### activity_logs
```sql
id BIGINT PK AUTO_INCREMENT
user_id INT FK
action ENUM('login','logout','view','search','copy','bookmark','feedback')
target_id INT
target_type VARCHAR(50)
meta JSON
ip VARCHAR(45)
user_agent VARCHAR(500)
created_at TIMESTAMP
INDEX idx_user_action (user_id, action, created_at)
INDEX idx_created (created_at)
```

### feedback
```sql
id INT PK AUTO_INCREMENT
qa_id INT FK
user_id INT FK
type ENUM('helpful','needs_fix')
comment TEXT
status ENUM('pending','resolved','dismissed') DEFAULT 'pending'
created_at TIMESTAMP
INDEX idx_status (status, created_at)
```

### settings
```sql
key VARCHAR(100) PK
value TEXT
updated_at TIMESTAMP
```

## API 설계
### 엔드포인트
- GET /api/qa.php?action=list&category=&keyword=&page=
- GET /api/qa.php?action=get&id=
- POST /api/auth.php {action: login|logout|check}
- POST /api/bookmark.php {action: toggle, qa_id}
- POST /api/feedback.php {qa_id, type, comment}
- GET /api/stats.php?action=personal|team|logs (admin)

### 응답 형식
```json
{"success":true,"data":{...},"meta":{"page":1,"total":100}}
{"success":false,"error":{"code":"E001","message":"..."}}
```

### 에러 코드
- E001: 인증 필요
- E002: 권한 없음
- E003: 잘못된 요청
- E004: 리소스 없음
- E005: 서버 오류
- E006: 계정 잠금
- E007: 요청 한도 초과

### Rate Limiting
- 검색 API: 분당 60회
- 로그인: 분당 10회
- 기타: 분당 120회

## MD 파싱 규칙
### 파일 포맷
```markdown
---
category: 계약
keywords: 계약서, 서명, 날인
pinned: false
---
## 질문 내용이 여기에
답변 내용 (마크다운 지원)
- 리스트 가능
- **볼드** 가능
```

### 동기화 전략
1. /data/*.md 스캔
2. SHA256 해시 비교
3. 변경분만 DB UPSERT
4. 삭제된 파일 → soft delete (is_deleted 플래그)
5. 관리자 "동기화" 버튼 또는 cron 1시간 주기

### 파싱 라이브러리
- front-matter: YAML 헤더 파싱
- Parsedown: MD → HTML 변환
- DOMPurify (JS): XSS 방지 렌더링

## 에러 처리
### 사용자 메시지
- 친절한 한국어, 기술 용어 노출 금지
- "잠시 후 다시 시도해주세요" 스타일

### 로깅
- 경로: /logs/error_YYYYMMDD.log
- 포맷: [2024-01-15 14:30:00] [ERROR] [auth.php:45] Invalid session
- 보관: 30일, 이후 자동 삭제 (cron)

### 장애 대응
- DB 연결 실패 → JSON 캐시 파일로 읽기 전용 모드
- API 타임아웃: 3초
- 치명적 오류 시 관리자 이메일 알림 (선택)

## 접근성 (a11y)
- 모든 인터랙티브 요소 키보드 접근 가능
- Tab 순서 논리적 구성 (tabindex 최소 사용)
- focus-visible 스타일 명확히
- 색상 대비 WCAG AA (4.5:1)
- aria-label, aria-expanded, aria-live 적절히
- 스크린리더 테스트: NVDA 기준

## 성능 최적화
### 프론트엔드
- Critical CSS 인라인 (<14KB)
- JS defer, 비필수 JS lazy load
- 이미지: WebP, lazy loading
- 폰트: font-display: swap, preload
- 검색 결과 가상 스크롤 (50개 이상 시)

### 백엔드
- Q&A 목록 JSON 캐시 (/cache/qa_list.json)
- 캐시 TTL: 1시간, 동기화 시 갱신
- FULLTEXT 검색, MATCH AGAINST
- 쿼리 결과 opcache 활용

### 목표 메트릭
- FCP: < 1s
- LCP: < 1.5s
- TTI: < 2s
- 검색 응답: < 200ms
- Lighthouse: 90+ (전 항목)

## 배포 및 유지보수
### 배포 체크리스트
1. includes/config.php DB 정보 설정
2. /logs, /cache 폴더 755 권한
3. install.php 실행 → 초기 admin 계정 생성
4. install.php 삭제 또는 IP 제한
5. .htaccess 보안 룰 확인

### .htaccess 보안
```apache
# 직접 접근 차단
<FilesMatch "\.(md|log|json)$">
  Require all denied
</FilesMatch>
RewriteRule ^(includes|logs|cache|data)/ - [F,L]
```

### 백업
- DB: mysqldump 일간 (cron 03:00)
- 파일: /data, /logs 주간 tar.gz
- 보관: 30일 롤링

### 업데이트 절차
1. Git pull (MD 파일)
2. 관리자 로그인 → 동기화 실행
3. 캐시 클리어 (/cache/*.json 삭제)

## 개발 Phase
### Phase 1: 기반 (3일)
- DB 스키마 생성
- config, db, auth 클래스
- 로그인/로그아웃
- 세션 관리, 보안 기초

### Phase 2: 핵심 (4일)
- MD 파싱 엔진
- Q&A 목록/상세 표시
- 카테고리 필터
- 메인 UI 구현

### Phase 3: 기능 (3일)
- 검색 + 자동완성
- 북마크
- 복사 기능
- 조회/복사 로깅

### Phase 4: 관리자 (3일)
- 대시보드
- 팀원 통계
- 활동 로그 뷰어
- 계정 관리
- 동기화 기능

### Phase 5: 완성 (2일)
- 다크모드, 폰트 설정
- 키보드 단축키
- 애니메이션 폴리싱
- 성능 최적화
- 접근성 검수

## 파일 구조
robin/
├── index.php
├── login.php
├── logout.php
├── admin/
│   ├── index.php (대시보드)
│   ├── users.php
│   ├── analytics.php
│   ├── logs.php
│   ├── sync.php
│   └── settings.php
├── api/
│   ├── auth.php
│   ├── qa.php
│   ├── bookmark.php
│   ├── feedback.php
│   └── stats.php
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── admin.css
│   └── js/
│       ├── app.js
│       ├── search.js
│       └── admin.js
├── includes/
│   ├── config.php
│   ├── db.php
│   ├── auth.php
│   ├── functions.php
│   └── markdown.php
├── data/
│   └── *.md
├── cache/
├── logs/
└── install.php

## 절대 금지
- 기초 개념 설명
- 서론/반복 설명
- MD 원본 임의 수정
- 저품질 템플릿 디자인
- 코드 생략(...)
- console.log, var_dump 잔존
- 하드코딩된 credentials
