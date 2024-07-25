// backend/routes/xRoutes.js
const express = require('express');
const xController = require('../controllers/xController');

const router = express.Router();

router.get('/info', xController.getVideoInfo);
router.post('/crop', xController.cropVideo);
router.get('/video/:filename', xController.streamVideo);
router.get('/download', xController.downloadVideo);

module.exports = router;