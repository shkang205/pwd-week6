const service = require('../src/services/restaurants.service');
const Restaurant = require('../src/models/restaurant.model');

beforeEach(() => Restaurant.reset());

describe('restaurants.service', () => {
  test('getAll은 배열을 반환', async () => {
    const list = await service.getAll();
    expect(Array.isArray(list)).toBe(true);
  });

  test('getById: 없는 id는 404 에러', async () => {
    await expect(service.getById(9999)).rejects.toMatchObject({ statusCode: 404 });
  });

  test('getById: 잘못된 id는 400 에러', async () => {
    await expect(service.getById('x')).rejects.toMatchObject({ statusCode: 400 });
  });

  test('create: 허용되지 않은 필드는 제거', async () => {
    const created = await service.create({
      name: 'A', category: '한식', location: 'B', hacked: true,
    });
    expect(created.hacked).toBeUndefined();
  });

  test('create: recommendedMenu 타입 검증', async () => {
    await expect(service.create({
      name: 'A', category: '한식', location: 'B', recommendedMenu: 'not array',
    })).rejects.toMatchObject({ statusCode: 400 });
  });

  test('모델이 반환한 객체를 수정해도 저장소에 영향 없음', async () => {
    const r = await service.getById(1);
    r.name = 'changed';
    const again = await service.getById(1);
    expect(again.name).not.toBe('changed');
  });
});
