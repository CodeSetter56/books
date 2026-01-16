import express, { RequestHandler } from 'express';
import { createUser, getUserSelf, loginUser, logoutUser, refreshAccessToken } from './userController';
import authenticate from '../middlewares/authenticate';
import { isLoggedIn } from '../middlewares/redirect';

const router = express.Router();

router.post('/register', isLoggedIn as RequestHandler , createUser)
router.post('/login', isLoggedIn as RequestHandler, loginUser)
router.get("/me", authenticate, getUserSelf as RequestHandler);
router.post("/refresh", refreshAccessToken);
router.post('/logout', authenticate, logoutUser)

export default router;