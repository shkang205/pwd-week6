// 라우트: URL 경로와 HTTP 메서드를 컨트롤러에 매핑
const { Router } = require('express');
const controller = require('../controllers/restaurants.controller');

const router = Router();

router.get('/', controller.getAll);
router.get('/popular', controller.getPopular); // :id보다 먼저 선언해야 함
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
