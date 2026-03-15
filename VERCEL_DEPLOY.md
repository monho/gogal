# Vercel 배포 가이드

## 1. GitHub에 코드 올리기

Vercel은 보통 GitHub 저장소와 연결해 배포합니다.

```bash
git init
git add .
git commit -m "Initial commit"
```

GitHub에서 새 저장소를 만든 뒤:

```bash
git remote add origin https://github.com/YOUR_USERNAME/diamondControl.git
git branch -M main
git push -u origin main
```

## 2. Vercel에서 프로젝트 가져오기

1. [vercel.com](https://vercel.com) 접속 후 로그인(또는 GitHub로 가입)
2. **Add New** → **Project** 클릭
3. **Import Git Repository**에서 방금 올린 저장소 선택
4. **Import** 클릭

## 3. 환경 변수 (선택)

Firebase 설정이 코드에 기본값으로 있어서 **없어도 빌드·실행은 됩니다.**  
다른 Firebase 프로젝트를 쓰려면 Vercel 프로젝트 **Settings → Environment Variables**에서 다음을 추가하세요.

| 이름 | 설명 |
|------|------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth 도메인 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | 프로젝트 ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage 버킷 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | 메시징 Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | 앱 ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Analytics 측정 ID (선택) |

## 4. 배포

- **Deploy** 클릭하면 Vercel이 `npm run build`를 실행하고 자동 배포합니다.
- 이후 `main` 브랜치에 푸시할 때마다 자동으로 재배포됩니다.

## 5. Firebase Auth 도메인 추가

배포 후 **Firebase Console → Authentication → Settings → Authorized domains**에  
Vercel에서 받은 도메인(예: `your-project.vercel.app`)을 추가해야 로그인이 동작합니다.

---

## Vercel CLI로 배포 (Git 없이)

```bash
npm i -g vercel
vercel
```

처음 실행 시 로그인하고 프로젝트 연결 후 배포됩니다. 환경 변수는 `vercel env add`로 추가하거나 웹 대시보드에서 설정하세요.
