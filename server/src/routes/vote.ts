import express, { Request, Response } from 'express';
import { VoteController } from '../controllers/vote';
import { authGuard } from '../middlewares/jwtAuthGuard';

let router = express.Router();
let voteController = new VoteController();

router.post('/getUserVote', authGuard, voteController.getUserVote);
router.post('/votePost', authGuard, voteController.votePost);
router.post('/removeVote', authGuard, voteController.removeVote);
router.post('/changeVote', authGuard, voteController.changeVote);

export {
    router
}