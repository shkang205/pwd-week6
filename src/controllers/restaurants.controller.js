// 컨트롤러: 요청에서 입력 수집 → 서비스 호출 → 응답 형식화
const restaurantService = require('../services/restaurants.service');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const data = await restaurantService.getAll({ category, search });
  res.json({ success: true, count: data.length, data });
});

const getPopular = asyncHandler(async (req, res) => {
  const data = await restaurantService.getPopular(req.query.limit ?? 5);
  res.json({ success: true, count: data.length, data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await restaurantService.getById(req.params.id);
  res.json({ success: true, data });
});

const create = asyncHandler(async (req, res) => {
  const data = await restaurantService.create(req.body);
  res.status(201).json({ success: true, message: '맛집이 등록되었습니다', data });
});

const update = asyncHandler(async (req, res) => {
  const data = await restaurantService.update(req.params.id, req.body);
  res.json({ success: true, message: '맛집 정보가 수정되었습니다', data });
});

const remove = asyncHandler(async (req, res) => {
  const data = await restaurantService.remove(req.params.id);
  res.json({ success: true, message: '맛집이 삭제되었습니다', data });
});

module.exports = { getAll, getPopular, getById, create, update, remove };
