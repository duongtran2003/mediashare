import express, { Router } from 'express';
import { UserController } from '../controllers/user';
import { authGuard } from '../middlewares/jwtAuthGuard';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime';

const router: Router = express.Router();
const userController = new UserController();
const acceptExt = ['jpeg', 'png', 'jpg'];

const storage = multer.diskStorage({
    destination: './public',
    filename: (req, file, cb) => {
        const fileExtension = mime.getExtension(file.mimetype);
        const newFilename = `${uuidv4()}${file.originalname}-${Date.now()}.${fileExtension}`;
        cb(null, newFilename); 
    },
})
const upload = multer({ 
    storage: storage, 
    fileFilter: (req, file, cb) => {
        const fileExtension: string = <string>mime.getExtension(file.mimetype);
        if (!acceptExt.includes(fileExtension)) {
            cb(new Error("Wrong type!!!"));
        }
        else {
            cb(null, true);
        }
    }
});

router.post('/checkUsername', userController.checkUsername);
router.post('/getUserInfo', userController.getUserInfo);
router.post('/queryMatchedUser', userController.queryMatched);
router.post('/setAvatar', authGuard, upload.single('file'), userController.setAvatar);

export {
    router
}