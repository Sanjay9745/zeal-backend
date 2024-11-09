const express = require("express");
const router = express.Router();
const { upload, addBanner } = require("../User/User"); // Adjust path if needed

// Route to add a new banner
router.post("/add", upload.single('image'), addBanner);

module.exports = router;
