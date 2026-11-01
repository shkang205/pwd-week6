// 서버 진입점: app.js를 불러와 포트 설정 후 HTTP 서버 시작
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Ajou Campus Foodmap API listening on port ${PORT}`);
});
