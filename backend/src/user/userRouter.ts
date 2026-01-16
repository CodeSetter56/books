import express, { RequestHandler } from 'express';
import { createUser, getUserSelf, loginUser, logoutUser, refreshAccessToken } from './userController';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.get("/me", authenticate, getUserSelf as RequestHandler);
router.post("/refresh", refreshAccessToken);
router.post('/logout', authenticate, logoutUser)

export default router;