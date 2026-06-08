import { Router } from 'express';
import { registerUser, loginUser, refreshTokenHandler, logoutUser } from './controller';
import { requireAuthLevel } from './middleware';

export const dpAuthRouter = Router();

// Public auth endpoints
dpAuthRouter.post('/register', registerUser);
dpAuthRouter.post('/login', loginUser);
dpAuthRouter.post('/refresh', refreshTokenHandler);
dpAuthRouter.post('/logout', logoutUser);

// -------------------------------------------------------------
// Protected Route Examples using Strict 5-Level RBAC
// -------------------------------------------------------------

// Level 1: User (and above)
dpAuthRouter.get('/protected/user-profile', requireAuthLevel(1), (req, res) => {
    res.json({ message: 'L1 Access Granted', user: req.user });
});

// Level 2: Member (and above)
dpAuthRouter.post('/protected/create-client', requireAuthLevel(2), (req, res) => {
    res.json({ message: 'L2 Access Granted: Client profile creation authorized.', user: req.user });
});

// Level 3: Staff (and above)
dpAuthRouter.put('/protected/update-inventory', requireAuthLevel(3), (req, res) => {
    res.json({ message: 'L3 Access Granted: Inventory update authorized.', user: req.user });
});

// Level 4: Admin (and above)
dpAuthRouter.post('/protected/approve-quote', requireAuthLevel(4), (req, res) => {
    res.json({ message: 'L4 Access Granted: High-value quote approved.', user: req.user });
});

// Level 5: Developer (only)
dpAuthRouter.get('/protected/system-logs', requireAuthLevel(5), (req, res) => {
    res.json({ message: 'L5 Access Granted: System logs accessed securely.', user: req.user });
});
