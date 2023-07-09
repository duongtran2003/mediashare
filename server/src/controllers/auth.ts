import { Request, Response } from "express";
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


interface IJson {
    email?: string,
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

    async login(req: Request, res: Response) {
        const { username, password } = req.body as IJson;
        const user = await User.findOne({
            username: username,
        });
        if (!user) {
            return res.json({
                message: "Wrong credentials",
            })
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.json({
                message: "Wrong credentials",
            })
        }
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET!);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({
            username: user.username,
            message: "Login success",
        });
    }

    index(req: Request, res: Response) {
        return res.json({
            username: res.locals.claims.username,
        });
    }
    
    logout(req: Request, res: Response) {
        res.cookie('jwt', "", {
            httpOnly: true,
            maxAge: 0,
        });
        return res.json({
            message: "Logout success",
        });
    }
}

export {
    AuthController
}