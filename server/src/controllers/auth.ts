import { Request, Response } from "express";
import { User } from '../models/User';
import bcrypt from 'bcrypt';

interface IJson {
    email: string,
    username: string,
    password: string,
}

class AuthController {
    async register(req: Request, res: Response) {
        //todo: validate this fucking json
        const { email, username, password } = req.body as IJson;
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);
        User.findOne({
            $or: [
                {
                    email: email
                },
                {
                    username: username,
                }
            ]
        })
        .then((user) => {
            if (!user) {
                //todo create user
                let newUser = {
                    email: email,
                    username: username,
                    password: hashedPassword,
                }
                User.create(newUser)
                .then((user) => {
                    return res.json({
                        message: "Register successfully",
                        email: user.email,
                        username: user.username,
                        password: user.password,
                    })
                })
                .catch((e) => {
                    return res.json({
                        message: "Server error",
                    })
                })
            }
            else {
                return res.json({
                    message: "It seems like you already have one."
                });
            }
        })
        .catch((e) => {
            return res.json({
                message: "Server error",
            });
        })
    }
}

export {
    AuthController
}