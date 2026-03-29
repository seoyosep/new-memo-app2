# Memo App (Next.js + Prisma + SQLite)

회원가입/로그인 기반 메모 CRUD 앱입니다.

## 1) 설치

```bash
npm install
```

## 2) 환경 변수

`.env.example`를 복사해 `.env` 파일을 만드세요.

```bash
copy .env.example .env
```

- `DATABASE_URL`: SQLite 경로
- `SESSION_SECRET`: 세션 서명용 비밀키

## 3) Prisma 마이그레이션

```bash
npx prisma migrate dev --name init
```

## 4) 개발 서버 실행

```bash
npm run dev
```

## shadcn 테마 적용

요청하신 디자인 시스템은 아래 명령으로 적용 가능합니다.

```bash
npx shadcn@latest add https://tweakcn.com/r/themes/retro-arcade.json
```

이미 `app/globals.css`는 전달하신 값으로 세팅되어 있습니다.
