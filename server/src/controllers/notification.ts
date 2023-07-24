import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

class NotificationController {
    query(req: Request, res: Response) {
        const username = res.locals.claims.username;
        Notification.find({ target: username }, "dest message source status target _id")
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
        .then((notis) => {
            res.statusCode = 200;
            return res.json({
                message: "success",
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