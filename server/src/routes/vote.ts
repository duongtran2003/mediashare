import express, { Request, Response } from 'express';
import { VoteController } from '../controllers/vote';
import { authGuard } from '../middlewares/jwtAuthGuard';

let router = express.Router();
let voteController = new VoteController();

router.get('/getUserVote', authGuard, voteController.getUserVote);
router.post('/votePost', authGuard, voteController.votePost);

export {
    router
}