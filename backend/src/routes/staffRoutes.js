const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// L3 Staff required
router.use(verifyToken, requireRole(3));

router.get('/kanban', staffController.getKanbanJobs);
router.post('/kanban/update', staffController.updateJobStatus);
router.get('/machines', staffController.getMachines);
router.post('/machines/toggle', staffController.toggleMachineStatus);
router.post('/inventory/log', staffController.logInventory);

module.exports = router;
