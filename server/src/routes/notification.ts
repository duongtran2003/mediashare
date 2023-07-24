import express from 'express';
import { NotificationController } from '../controllers/notification';
import { authGuard } from '../middlewares/jwtAuthGuard';

const router = express.Router();

const notificationController = new NotificationController();

router.get('/query', authGuard, notificationController.query);

export {
    router
}