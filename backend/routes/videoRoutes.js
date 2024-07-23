
//backend\routes\videoRoutes.js
const express = require("express");
const videoController = require("../controllers/videoController");

const router = express.Router();

router.post("/crop-video", videoController.cropVideo);

module.exports = router;
