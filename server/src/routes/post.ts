import express, { Request, Response } from 'express';
import { PostController } from '../controllers/post';
import { authGuard } from '../middlewares/jwtAuthGuard';

let router = express.Router();
let postController = new PostController();

router.post('/create', authGuard, postController.create);
router.get('/index', authGuard, postController.index);

export {
    router
}