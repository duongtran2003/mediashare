import express from 'express';
import { router as authRoute } from './auth';
import { router as postRoute } from './post';
import { router as userRoute } from './user';
import { router as voteRouter } from './vote';
import { router as commentRouter } from './comment';
import { router as notificationRouter } from './notification';
import { router as friendRouter } from './friend';

let router = express.Router();
router.use('/auth', authRoute);
router.use('/post', postRoute);
router.use('/user', userRoute);
router.use('/vote', voteRouter);
router.use('/comment', commentRouter);
router.use('/notification', notificationRouter);
router.use('/friend', friendRouter);

export {
    router
}
