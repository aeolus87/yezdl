const express = require("express");
const { cropVideo } = require("../controllers/videoController");

const router = express.Router();

router.post("/crop-video", cropVideo);

module.exports = router;
