const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All admin routes must be accessed by an L4 user
router.use(verifyToken, requireRole(4));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.post('/users/invite', adminController.inviteUser);

router.get('/pricing', adminController.getPricingMatrix);
router.post('/pricing/update', adminController.updatePricingMatrix);
router.get('/finance/ledger', adminController.getFinancialLedger);
router.post('/quotes/generate', adminController.generateQuote);

module.exports = router;
