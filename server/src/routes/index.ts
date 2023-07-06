import express from 'express';
import { router as authRoute } from './auth';
import { router as postRoute } from './post';

let router = express.Router();
router.use('/auth', authRoute);
router.use('/post', postRoute);

export {
    router
}
