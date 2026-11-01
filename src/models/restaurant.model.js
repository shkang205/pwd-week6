// Restaurant 모델: 데이터 접근 로직 (현재는 메모리 저장소, 추후 DB로 교체 예정)
// DB 교체를 고려해 모든 메서드를 async로 작성
const seed = require('../data/restaurants.json');

let restaurants = [];
let nextId = 1;

const clone = (data) => JSON.parse(JSON.stringify(data));

function reset() {
  restaurants = clone(seed);
  nextId = restaurants.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

reset();

async function findAll() {
  return clone(restaurants);
}

async function findById(id) {
  const found = restaurants.find((r) => r.id === id);
  return found ? clone(found) : null;
}

async function create(data) {
  const restaurant = { ...data, id: nextId++ };
  restaurants.push(restaurant);
  return clone(restaurant);
}

async function update(id, data) {
  const index = restaurants.findIndex((r) => r.id === id);
  if (index === -1) return null;
  restaurants[index] = { ...restaurants[index], ...data, id };
  return clone(restaurants[index]);
}

async function remove(id) {
  const index = restaurants.findIndex((r) => r.id === id);
  if (index === -1) return null;
  const [removed] = restaurants.splice(index, 1);
  return removed;
}

module.exports = { findAll, findById, create, update, remove, reset };
