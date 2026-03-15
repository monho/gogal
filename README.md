# 다이아몬드 컨트롤 (고갈서버 스타일)

[고갈서버](https://bngts.com/contents/Suni_Moon) 레이아웃과 다크 퍼플 베이스 컬러를 참고한 데모 사이트입니다.

## 기술 스택

- **Next.js 14** (App Router)
- **Tailwind CSS** (다크 퍼플 테마)
- **shadcn/ui** (Button, Card, Tabs, Select, Badge)
- **Magic UI** 스타일 (Framer Motion 기반 MagicCard)
- **Nivo** (시청자 추이 막대 차트)

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속하세요.

## 구성

- **헤더**: 입주자통계, 라이브/오프라인 인원
- **히어로**: 타이틀, 상태 뱃지, 자동 멀티뷰 카드
- **필터**: 상태(전체/라이브/오프라인), 역할, 길드, 정렬, 배치(2/4/6/8열)
- **시청자 추이**: Nivo Bar 차트 (예시 데이터)
- **라이브 그리드**: 스트리머 카드 (Magic UI 스타일 호버)
- **오프라인 그리드**: 페이지네이션

## 컬러 (CSS 변수)

- `--background`: 다크 퍼플 베이스
- `--primary`: 바이올렛 액센트
- `--live`: 라이브 녹색
- `--card`, `--border`: 고갈서버 느낌의 어두운 톤
