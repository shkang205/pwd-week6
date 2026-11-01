const request = require('supertest');
const app = require('../src/app');
const Restaurant = require('../src/models/restaurant.model');

beforeEach(() => Restaurant.reset());

describe('기본 엔드포인트', () => {
  test('GET /health → 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('없는 경로 → 404 JSON', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/restaurants', () => {
  test('전체 목록 반환', async () => {
    const res = await request(app).get('/api/restaurants');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBe(res.body.data.length);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('category 필터', async () => {
    const res = await request(app).get('/api/restaurants').query({ category: '한식' });
    expect(res.status).toBe(200);
    expect(res.body.data.every((r) => r.category === '한식')).toBe(true);
  });

  test('search로 이름/메뉴 검색', async () => {
    const res = await request(app).get('/api/restaurants').query({ search: '떡볶이' });
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('CORS 헤더 포함', async () => {
    const res = await request(app).get('/api/restaurants').set('Origin', 'https://example.vercel.app');
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });
});

describe('GET /api/restaurants/popular', () => {
  test('평점 내림차순, limit 적용', async () => {
    const res = await request(app).get('/api/restaurants/popular').query({ limit: 3 });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    const ratings = res.body.data.map((r) => r.rating);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  test('잘못된 limit → 400', async () => {
    const res = await request(app).get('/api/restaurants/popular').query({ limit: 'abc' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/restaurants/:id', () => {
  test('존재하는 id → 200', async () => {
    const res = await request(app).get('/api/restaurants/1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(1);
  });

  test('없는 id → 404', async () => {
    const res = await request(app).get('/api/restaurants/9999');
    expect(res.status).toBe(404);
  });

  test('숫자가 아닌 id → 400', async () => {
    const res = await request(app).get('/api/restaurants/abc');
    expect(res.status).toBe(400);
  });
});

describe('POST /api/restaurants', () => {
  const newRestaurant = {
    name: '테스트식당',
    category: '한식',
    location: '아주대 정문 앞',
    rating: 4.0,
    recommendedMenu: ['비빔밥'],
  };

  test('정상 생성 → 201, 기본값 채움', async () => {
    const res = await request(app).post('/api/restaurants').send(newRestaurant);
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject(newRestaurant);
    expect(res.body.data.id).toEqual(expect.any(Number));
    expect(res.body.data.likes).toBe(0);

    const check = await request(app).get(`/api/restaurants/${res.body.data.id}`);
    expect(check.status).toBe(200);
  });

  test('필수 필드 누락 → 400', async () => {
    const res = await request(app).post('/api/restaurants').send({ name: '이름만' });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  test('rating 범위 초과 → 400', async () => {
    const res = await request(app).post('/api/restaurants').send({ ...newRestaurant, rating: 10 });
    expect(res.status).toBe(400);
  });

  test('잘못된 JSON → 400', async () => {
    const res = await request(app)
      .post('/api/restaurants')
      .set('Content-Type', 'application/json')
      .send('{"name": ');
    expect(res.status).toBe(400);
  });

  test('id는 클라이언트가 지정할 수 없음', async () => {
    const res = await request(app).post('/api/restaurants').send({ ...newRestaurant, id: 1 });
    expect(res.status).toBe(201);
    expect(res.body.data.id).not.toBe(1);
  });
});

describe('PUT /api/restaurants/:id', () => {
  test('부분 수정 → 200', async () => {
    const res = await request(app).put('/api/restaurants/1').send({ rating: 3.5 });
    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBe(3.5);
    expect(res.body.data.name).toBeDefined();
  });

  test('멱등성: 같은 요청 반복 시 결과 동일', async () => {
    const a = await request(app).put('/api/restaurants/2').send({ likes: 100 });
    const b = await request(app).put('/api/restaurants/2').send({ likes: 100 });
    expect(a.body.data).toEqual(b.body.data);
  });

  test('없는 id → 404', async () => {
    const res = await request(app).put('/api/restaurants/9999').send({ rating: 3 });
    expect(res.status).toBe(404);
  });

  test('잘못된 값 → 400', async () => {
    const res = await request(app).put('/api/restaurants/1').send({ name: '' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/restaurants/:id', () => {
  test('삭제 후 조회 시 404', async () => {
    const res = await request(app).delete('/api/restaurants/1');
    expect(res.status).toBe(200);

    const check = await request(app).get('/api/restaurants/1');
    expect(check.status).toBe(404);
  });

  test('없는 id → 404', async () => {
    const res = await request(app).delete('/api/restaurants/9999');
    expect(res.status).toBe(404);
  });
});
