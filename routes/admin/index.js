const express = require('express');
const router = express.Router();
const adminController = require('./admin'); // Adjust path as needed
const adminAuth = require('../../middlewares/AdminAuth'); // Adjust path as needed

// Register a new admin
router.post('/register', adminController.register);

// Login an admin
router.post('/login', adminController.login);

// Protected route
router.get('/protected', adminAuth, adminController.protected);

module.exports = router;
