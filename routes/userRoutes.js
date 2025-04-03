import express from 'express';
import {registerUser, loginUser, getUser} from '../controllers/userController.js';
import { checkUser } from '../middlewares/checkUserExistence.js';
import { authMiddleware } from '../middlewares/userAuth.js';


const userRouter = express.Router();

userRouter.get('/me', authMiddleware, getUser);
userRouter.post('/register', checkUser, registerUser);
userRouter.post('/login', loginUser);

export default userRouter;