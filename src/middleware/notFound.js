const HttpError = require('../utils/httpError');

// 매칭되는 라우트가 없을 때 404 에러 생성
const notFound = (req, res, next) => {
  next(new HttpError(404, `경로를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
