import { Request, Response } from "express";
import { User } from '../models/User';
import path from 'path';
import fs from 'fs';

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
                        avatarPath: user.avatarPath,
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

    queryMatched(req: Request, res: Response): void {
        const username = req.body.username;
        const regex = `.*${username.split('').join('.*')}.*`;
        User.find({ username: { $regex: regex } }).select('username')
            .then((users) => {
                res.statusCode = 200;
                if (!users) {
                    return res.json({
                        message: "No user found",
                    });
                }
                else {
                    return res.json({
                        message: "Query success",
                        users: users,
                    })
                }
            })
            .catch((err) => {
                res.statusCode = 500;
                return res.json({
                    message: "Server's error",
                })
            })
    }

    async setAvatar(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const filename = req.file?.filename;
        let filenameToDelete: string | undefined = "";
        await User.findOne({ username: username })
            .then((user) => {
                if (user) {
                    filenameToDelete = user.avatarPath.split('/').pop();
                    console.log(filenameToDelete);
                }
                else {
                    filenameToDelete = "";
                }
            })
            .catch((err) => {
                filenameToDelete = "";
            });
        if (filenameToDelete) {
            fs.unlink(`./public/${filenameToDelete}`, (err) => {
                console.log(err);
            })
        }
        await User.findOneAndUpdate({
            username: username,
        }, {
            avatarPath: `http://localhost:8000/static/${filename}`
        }, { new: true })
            .then((updatedUser) => {
                if (updatedUser) {
                    res.statusCode = 200;
                    return res.json({
                        username: updatedUser.username,
                        avatarPath: updatedUser.avatarPath,
                    });
                }
                else {
                    res.statusCode = 500;
                    return res.json({
                        message: "Server's error",
                    })
                }
            })
            .catch((err) => {
                res.statusCode = 500;
                return res.json({
                    message: err,
                })
            });
    }
}

export {
    UserController
}