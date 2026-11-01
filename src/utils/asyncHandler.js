// async 라우트 핸들러에서 발생한 에러(rejected Promise)를 next()로 전달
// Express 5는 이를 자동으로 처리하지만, 흐름을 명시적으로 드러내기 위해 사용
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
