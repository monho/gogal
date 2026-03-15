# Firebase Functions – Bianca 후원 수집

Bianca API WebSocket을 **서버(Node.js)**에서 연결해 후원 이벤트를 Firestore에 저장합니다.  
브라우저가 아닌 Functions에서 `ws://`로 연결하므로 **HTTPS 배포 환경에서도 동작**합니다.

## 동작

1. `biancaDonationListener` HTTP 함수가 호출되면 즉시 200 응답을 보냅니다.
2. Firestore `streamers` 컬렉션에서 SOOP(아프리카) + BJ ID가 있는 스트리머 목록을 읽습니다.
3. 스트리머별로 Bianca `ws://streamer.biancaapi.com?platformId=afreeca&bjId=...` 에 연결합니다.
4. 후원 메시지(`AFREECA_DONATION`)를 받을 때마다 Firestore `donations` 컬렉션에 문서를 추가합니다.
5. 약 8분 후 WebSocket을 모두 닫고 함수가 종료됩니다. (Functions 타임아웃 9분 전에 종료)

## 배포

### 1. Firebase CLI 로그인 및 프로젝트 지정

```bash
npm install -g firebase-tools
firebase login
# 프로젝트가 gogal-bf068이 아니면:
firebase use <프로젝트_ID>
```

### 2. Functions 의존성 설치 및 배포

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

배포 후 콘솔에 다음 URL이 나옵니다:

```
https://<region>-<project>.cloudfunctions.net/biancaDonationListener
```

### 3. 주기 실행 (Cloud Scheduler)

Firebase 콘솔 → **Functions** → `biancaDonationListener` → **트리거**에서  
**Cloud Scheduler**로 5~10분마다 위 URL을 GET 호출하도록 설정하면, 후원 수집이 계속 이어집니다.

또는 Google Cloud Console → **Cloud Scheduler** → 작업 만들기:

- 빈도: `*/5 * * * *` (5분마다)
- 대상: HTTP
- URL: `https://<region>-<project>.cloudfunctions.net/biancaDonationListener`

## Firestore `donations` 컬렉션

각 문서 필드 예시:

- `streamerId`, `streamerName`: 스트리머 정보
- `platform`: `"afreeca"`
- `nickname`, `message`, `payAmount`: 후원 내용
- `at`: 수신 시각(ms)

웹/앱 후원 대시보드는 이 컬렉션을 조회·실시간 리스너로 사용하면 됩니다.

## 로컬 테스트

```bash
cd functions
npm run build
npx firebase emulators:start --only functions
```

다른 터미널에서:

```bash
curl "http://127.0.0.1:5001/<project>/<region>/biancaDonationListener"
```
