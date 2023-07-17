import express, { Router } from 'express';
import { UserController } from '../controllers/user';
import { authGuard } from '../middlewares/jwtAuthGuard';
import multer from 'multer';

const router: Router = express.Router();
const userController = new UserController();

const upload = multer();

router.post('/checkUsername', userController.checkUsername);
router.post('/getUserInfo', userController.getUserInfo);
router.post('/queryMatchedUser', userController.queryMatched);
router.post('/setAvatar', authGuard, upload.single('file'), userController.setAvatar);

export {
    router
}