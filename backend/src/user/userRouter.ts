import express from 'express';
import { createUser, loginUser, logoutUser, refreshAccessToken } from './userController';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.post("/refresh", refreshAccessToken);
router.post('/logout', authenticate, logoutUser)

export default router;