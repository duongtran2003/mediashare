import express, { Router } from 'express';
import { UserController } from '../controllers/user';

const router: Router = express.Router();
const userController = new UserController();

router.post('/checkUsername', userController.checkUsername);
router.post('/getUserInfo', userController.getUserInfo);
router.post('/queryMatchedUser', userController.queryMatched);

export {
    router
}