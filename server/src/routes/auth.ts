import express, { Request, Response } from 'express';
import { AuthController } from '../controllers/auth';
import { authGuard } from '../middlewares/jwtAuthGuard';

let router = express.Router();
let authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/index', authGuard, authController.index);
router.get('/logout', authGuard, authController.logout);

export {
    router
}