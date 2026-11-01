// 공통 에러 핸들러: 모든 에러를 일관된 JSON 형식으로 응답
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // express.json() 파싱 실패 (잘못된 JSON 본문)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: '잘못된 JSON 형식입니다' });
  }

  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) console.error(err);

  const body = {
    success: false,
    message: statusCode >= 500 ? '서버 내부 오류가 발생했습니다' : err.message,
  };
  if (err.details) body.errors = err.details;

  res.status(statusCode).json(body);
};

module.exports = errorHandler;
