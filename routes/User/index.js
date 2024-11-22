const express = require("express");
const router = express.Router();
const { upload, addBanner,getBanner } = require("../User/User"); // Adjust path if needed

// Route to add a new banner
router.post("/add", upload.array('image',10), addBanner);
router.get("/getBanners",getBanner)

module.exports = router;
