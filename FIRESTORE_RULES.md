# Firestore 보안 규칙 가이드

## 컬렉션 구조

### users (관리자 여부)
- 문서 ID: Firebase Auth **UID**
- 필드: `isAdmin` (boolean) — true인 유저만 관리자 로그인 가능 (관리자 모드일 때)

### settings/app (로그인 모드)
- 필드: `allowNormalLogin` (boolean)
  - false: 관리자만 로그인 가능 (users/{uid}.isAdmin === true)
  - true: 모든 구글 로그인 허용

## 규칙 예시

Firebase Console → Firestore Database → 규칙에서 아래처럼 설정할 수 있습니다.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }
    match /settings/app {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    match /streamers/{docId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## 자동 생성

- **구글 로그인 시** `users/{uid}` 문서가 없으면 자동으로 **isAdmin: false**로 생성됩니다.
- 컬렉션이 안 생기면: **Firestore 규칙**에 위 `users` 규칙(create 허용)이 반드시 있어야 합니다. 규칙 저장 후 다시 로그인해 보세요.

## 관리자로 만들기

- **최초 관리자**: Firestore → `users` 컬렉션 → 본인 UID 문서에서 `isAdmin` 필드를 **true**로 수정하세요. (Authentication에서 UID 확인)
- 다른 계정을 관리자로 만들려면:
  1. Firebase Console → Authentication에서 해당 계정 UID 확인
  2. Firestore → users 컬렉션 → 해당 UID 문서에서 `isAdmin`을 **true**로 수정
  3. 해당 유저가 페이지를 새로고침하면 관리 버튼이 보입니다.
