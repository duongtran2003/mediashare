import express from 'express';
import { router as authRoute } from './auth';

let router = express.Router();
router.use('/auth', authRoute);

export {
    router
}
