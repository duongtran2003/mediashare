import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

class NotificationController {
    query(req: Request, res: Response) {
        const username = res.locals.claims.username;
        Notification.find({ target: username })
        .then((notifications) => {
            res.statusCode = 200;
            return res.json({
                notifications: notifications,
            });
        })
        .catch((err) => {
            res.statusCode = 500;
            return res.json({
                message: "Server's error",
            });
        })
    }
    delete(req: Request, res: Response) {
        const username = res.locals.claims.username;
        Notification.deleteOne({ _id: req.body._id })
        .then((noti) => {
            res.statusCode = 200;
            return res.json({
                noti,
            })
        })
        .catch((err) => {
            res.statusCode = 500;
            return res.json({
                message: "Server's error",
            });
        })
    }
}

export {
    NotificationController,
}