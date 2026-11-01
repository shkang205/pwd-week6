// 상태 코드를 가진 에러 객체 (에러 핸들러가 응답 코드로 사용)
class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    if (details) this.details = details;
  }
}

module.exports = HttpError;
