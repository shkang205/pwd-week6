// Express 앱 설정: 핵심 미들웨어, 라우터, 에러 핸들러 연결
const express = require('express');
const cors = require('cors');

const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const restaurantRoutes = require('./routes/restaurants.routes');

const app = express();

// CORS: CLIENT_ORIGIN 환경변수에 쉼표로 구분된 허용 도메인 지정 (미지정 시 전체 허용)
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim())
  : '*';

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(logger);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ajou Campus Foodmap API',
    endpoints: ['/health', '/api/restaurants', '/api/restaurants/popular', '/api/restaurants/:id'],
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api/restaurants', restaurantRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
