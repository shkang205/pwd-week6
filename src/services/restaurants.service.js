// 비즈니스 로직 계층: 검증, 필터링, 정렬 등 도메인 규칙 구현
const Restaurant = require('../models/restaurant.model');
const HttpError = require('../utils/httpError');

const REQUIRED_FIELDS = ['name', 'category', 'location'];
const ALLOWED_FIELDS = [
  'name', 'category', 'location', 'priceRange', 'rating',
  'description', 'recommendedMenu', 'likes', 'image',
];

function pickAllowed(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => ALLOWED_FIELDS.includes(key)),
  );
}

function validate(payload, { partial = false } = {}) {
  const errors = [];

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, '요청 본문은 JSON 객체여야 합니다');
  }

  if (!partial) {
    REQUIRED_FIELDS.forEach((field) => {
      if (payload[field] === undefined) errors.push(`${field}은(는) 필수 항목입니다`);
    });
  }

  ['name', 'category', 'location'].forEach((field) => {
    if (payload[field] !== undefined
      && (typeof payload[field] !== 'string' || payload[field].trim() === '')) {
      errors.push(`${field}은(는) 비어있지 않은 문자열이어야 합니다`);
    }
  });

  if (payload.rating !== undefined
    && (typeof payload.rating !== 'number' || payload.rating < 0 || payload.rating > 5)) {
    errors.push('rating은 0~5 사이의 숫자여야 합니다');
  }

  if (payload.likes !== undefined
    && (!Number.isInteger(payload.likes) || payload.likes < 0)) {
    errors.push('likes는 0 이상의 정수여야 합니다');
  }

  if (payload.recommendedMenu !== undefined
    && (!Array.isArray(payload.recommendedMenu)
      || !payload.recommendedMenu.every((m) => typeof m === 'string'))) {
    errors.push('recommendedMenu는 문자열 배열이어야 합니다');
  }

  if (errors.length) throw new HttpError(400, '입력값이 올바르지 않습니다', errors);
}

function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'id는 양의 정수여야 합니다');
  }
  return id;
}

async function getAll({ category, search } = {}) {
  let list = await Restaurant.findAll();

  if (category) list = list.filter((r) => r.category === category);

  if (search) {
    const keyword = search.toLowerCase();
    list = list.filter((r) => r.name.toLowerCase().includes(keyword)
      || (r.recommendedMenu || []).some((m) => m.toLowerCase().includes(keyword)));
  }

  return list;
}

async function getPopular(limit = 5) {
  const n = Number(limit);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'limit은 양의 정수여야 합니다');

  const list = await Restaurant.findAll();
  return list
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.likes ?? 0) - (a.likes ?? 0))
    .slice(0, n);
}

async function getById(rawId) {
  const restaurant = await Restaurant.findById(parseId(rawId));
  if (!restaurant) throw new HttpError(404, '해당 맛집을 찾을 수 없습니다');
  return restaurant;
}

async function create(payload) {
  validate(payload);
  const data = pickAllowed(payload);
  return Restaurant.create({
    recommendedMenu: [],
    likes: 0,
    rating: 0,
    ...data,
  });
}

async function update(rawId, payload) {
  const id = parseId(rawId);
  validate(payload, { partial: true });
  const updated = await Restaurant.update(id, pickAllowed(payload));
  if (!updated) throw new HttpError(404, '해당 맛집을 찾을 수 없습니다');
  return updated;
}

async function remove(rawId) {
  const removed = await Restaurant.remove(parseId(rawId));
  if (!removed) throw new HttpError(404, '해당 맛집을 찾을 수 없습니다');
  return removed;
}

module.exports = { getAll, getPopular, getById, create, update, remove };
