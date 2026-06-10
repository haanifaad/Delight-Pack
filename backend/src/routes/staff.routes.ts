import { Router } from 'express';
import { getJobs, updateJobStatus, getMaterials, logMaterialUsage, submitQAChecklist } from '../controllers/staff.controller';
import { authenticateToken, requireRoleLevel } from '../middlewares/auth.middleware';

const router = Router();

// Only L3 and above can access staff routes
router.use(authenticateToken, requireRoleLevel(3));

router.get('/jobs', getJobs);
router.patch('/jobs/:id/status', updateJobStatus);

router.get('/materials', getMaterials);
router.post('/materials/usage', logMaterialUsage);

router.post('/qa', submitQAChecklist);

export default router;
