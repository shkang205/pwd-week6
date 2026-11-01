# pwd-week6 · Ajou Campus Foodmap API

Express 5 + MVCS 패턴으로 만든 아주대 주변 맛집 REST API (실전웹서비스개발 6주차 과제)

## 프로젝트 구조

```
pwd-week6/
├── src/
│   ├── controllers/   # 요청 → 서비스 호출 → 응답 형식화
│   ├── data/          # 초기 더미 데이터 (DB로 교체 예정)
│   ├── middleware/    # 로깅, 404, 공통 에러 핸들러
│   ├── models/        # 데이터 접근 (async, 메모리 저장소)
│   ├── routes/        # URL·메서드 → 컨트롤러 매핑
│   ├── services/      # 검증·필터·정렬 등 비즈니스 로직
│   ├── utils/         # HttpError, asyncHandler
│   └── app.js         # Express 앱 설정
├── tests/             # Jest + Supertest (TDD)
└── server.js          # 서버 진입점
```

## 실행

```bash
npm install
npm run dev     # 개발 (파일 변경 시 자동 재시작)
npm start       # 운영
npm test        # 테스트
```

## API

| Method | URL | 설명 |
|---|---|---|
| GET | `/health` | 헬스 체크 |
| GET | `/api/restaurants` | 전체 목록 (`?category=한식`, `?search=떡볶이`) |
| GET | `/api/restaurants/popular` | 평점순 인기 맛집 (`?limit=5`) |
| GET | `/api/restaurants/:id` | 단일 조회 |
| POST | `/api/restaurants` | 생성 (필수: `name`, `category`, `location`) → 201 |
| PUT | `/api/restaurants/:id` | 수정 (부분 수정 가능) |
| DELETE | `/api/restaurants/:id` | 삭제 |

응답 형식

```json
{ "success": true, "count": 6, "data": [ ... ] }
{ "success": false, "message": "입력값이 올바르지 않습니다", "errors": ["..."] }
```

상태 코드: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error

## Render 배포

> 간단한 방법: Render → **New → Blueprint** → `pwd-week6` 저장소 선택 → Apply (`render.yaml` 설정 사용)

1. GitHub에 `pwd-week6` 저장소를 만들고 push
2. Render → **New → Web Service** → GitHub 저장소 연결
3. 설정
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
   - Environment Variable(선택): `CLIENT_ORIGIN=https://<내 vercel 주소>.vercel.app`
4. Auto-Deploy: On → 이후 `git push`만 하면 자동 재배포

> 무료 인스턴스는 15분간 요청이 없으면 잠들어, 첫 요청이 30초 이상 걸릴 수 있습니다.
> 데이터는 메모리에 저장되므로 재시작 시 초기 데이터로 돌아갑니다.

## React(pwd-week5) 연동

[pwd-week5](https://github.com/shkang205/pwd-week5)의 `src/services/api.ts`가 localStorage 대신 이 API를 호출합니다.
서버 주소는 pwd-week5의 `.env.production`(`https://pwd-week6.onrender.com`)과 `.env.development`(`http://localhost:3000`)에 있습니다.
아래는 기본 예시입니다.

```js
// .env (Vite 기준)  →  Vercel 환경변수에도 동일하게 등록
VITE_API_URL=https://pwd-week6-<username>.onrender.com

// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

export async function getRestaurants() {
  const res = await fetch(`${API_URL}/api/restaurants`);
  if (!res.ok) throw new Error('맛집 목록을 불러오지 못했습니다');
  const { data } = await res.json();
  return data;
}
```
