import { Request, Response } from "express";
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
    checkUsername(req: Request, res: Response) {
        User.findOne({
            username: req.body.username
        })
            .then((user) => {
                if (user) {
                    res.statusCode = 200;
                    return res.json({
                        message: "Username's already been used",
                    })
                }
                else {
                    res.statusCode = 200;
                    return res.json({
                        message: "OK",
                    })
                }
            })
            .catch((err) => {
                res.statusCode = 500;
                return res.json({
                    message: "Server's error",
                })
            });
    }

    getUserInfo(req: Request, res: Response) {
        const username = req.body.username;
        User.findOne({
            username: username,
        })
        .then((user) => {
            if (!user) {
                res.statusCode = 404;
                return res.json({
                    message: `User ${username} does not exist`,
                })
            }
            else {
                res.statusCode = 200;
                return res.json({
                    email: user.email,
                    username: user.username,
                }) 
            }
        })
        .catch((err) => {
            res.statusCode = 500;
            return res.json({
                message: "Server's error",
            })
        });
    }
}

export {
    UserController
}