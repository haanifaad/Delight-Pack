const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Example protected route for the frontend to verify session validity and get current user data
router.get('/me', verifyToken, authController.me);

module.exports = router;
