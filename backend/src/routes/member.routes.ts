import { Router } from 'express';
import {
  getClients, getClientById, createClient,
  getQuotes, createQuote, updateQuote,
  getDeals, updateDealStage,
} from '../controllers/member.controller';
import { authenticateToken, requireRoleLevel } from '../middlewares/auth.middleware';

const router = Router();

// Only L2 and above can access member routes
router.use(authenticateToken, requireRoleLevel(2));

// Clients
router.get('/clients', getClients);
router.get('/clients/:id', getClientById);
router.post('/clients', createClient);

// Quotes
router.get('/quotes', getQuotes);
router.post('/quotes', createQuote);
router.patch('/quotes/:id', updateQuote);

// Deals / Pipeline
router.get('/deals', getDeals);
router.patch('/deals/:id/stage', updateDealStage);

export default router;
