// 요청 로깅 미들웨어: 메서드, URL, 상태 코드, 처리 시간 기록
const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
};

module.exports = logger;
