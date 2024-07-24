const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/crop-video', videoController.cropVideo);

module.exports = router;