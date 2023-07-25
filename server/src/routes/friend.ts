import express from 'express';
import { FriendController } from '../controllers/friend';
import { authGuard } from '../middlewares/jwtAuthGuard';

const router = express.Router();
const friendController = new FriendController();

router.get('/query', authGuard, friendController.query);
router.post('/checkStatus', authGuard, friendController.checkStatus);
router.post('/sendRequest', authGuard, friendController.sendRequest);
router.post('/cancelRequest', authGuard, friendController.cancelRequest);
router.post('/confirmRequest', authGuard, friendController.confirmRequest);

export {
    router
}