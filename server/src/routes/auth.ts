import express, { Request, Response } from 'express';
import { AuthController } from '../controllers/auth';

let router = express.Router();
let authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);

export {
    router
}