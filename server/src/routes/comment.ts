import express, { Request, Response } from 'express';
import { CommentController } from '../controllers/comment';
import { authGuard } from '../middlewares/jwtAuthGuard';

let router = express.Router();
let commentController = new CommentController();

router.post('/queryComment', commentController.queryComment);
router.post('/create', authGuard, commentController.create);

export {
    router
}