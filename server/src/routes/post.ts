import express, { Request, Response } from 'express';
import { PostController } from '../controllers/post';
import { authGuard } from '../middlewares/jwtAuthGuard';
import multer from 'multer';
import mime from 'mime';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

let router = express.Router();
let postController = new PostController();

let acceptExt = ['mp4', 'jpeg', 'jpg', 'png'];

const storage = multer.diskStorage({
    destination: './public',
    filename: (req, file, cb) => {
        const fileExtension = mime.getExtension(file.mimetype);
        const newFilename = `${uuidv4()}${slugify(file.originalname)}-${Date.now()}.${fileExtension}`;
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
})

router.post('/create', authGuard, upload.single('file'), postController.create);
router.post('/index', postController.index);
router.post('/queryById', postController.queryById);

export {
    router
}