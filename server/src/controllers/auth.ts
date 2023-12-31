import { Request, Response } from "express";
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


interface IJson {
    email?: string,
    username: string,
    password: string,
    avatarPath: string,
}

class AuthController {
    async register(req: Request, res: Response) {
        const { email, username, password } = req.body as IJson;

        //validate
        if (!(typeof email) || !(typeof username) || !(typeof password)) {
            res.statusCode = 400;
            return res.json({
                message: "nice try dude",
            });
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email!)) {
            res.statusCode = 400;
            return res.json({
                message: "nice try dude",
            });
        }
        if (!/^[a-zA-Z0-9_]{6,20}$/.test(username)) {
            res.statusCode = 400;
            return res.json({
                message: "nice try dude",
            });
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(password)) {
            res.statusCode = 400;
            return res.json({
                message: "nice try dude",
            });
        }
        //validate

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        //fuck need to rewrite this mess

        const user = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (user) {
            res.statusCode = 409;
            if (user.username == username) {
                return res.json({
                    type: "username",
                    message: "Username's already been used",
                })
            }
            else {
                return res.json({
                    type: "email",
                    message: "Email's already been used",
                });
            }
        }
        User.create({
            email: email,
            username: username,
            password: hashedPassword,
            avatarPath: 'http://localhost:8000/static/default.png',
        })
            .then((user) => {
                res.statusCode = 200;
                return res.json({
                    message: "Account created",
                });
            })
            .catch((err) => {
                res.statusCode = 500;
                return res.json({
                    message: "Server's error",
                })
            });
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body as IJson;
        const user = await User.findOne({
            username: username,
        });
        if (!user) {
            res.statusCode = 401;
            return res.json({
                message: "Wrong credentials",
            })
        }
        if (!await bcrypt.compare(password, user.password)) {
            res.statusCode = 401;
            return res.json({
                message: "Wrong credentials",
            })
        }
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET!);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 4 * 60 * 60 * 1000,
        });
        res.statusCode = 200;
        return res.json({
            username: user.username,
            avatarPath: user.avatarPath,
            message: "Login success",
        });
    }



    async getUsername(req: Request, res: Response) {
        const claims = res.locals.claims;
        User.findOne({
            username: claims.username,
        })
            .then((user) => {
                if (user) {
                    res.statusCode = 200;
                    return res.json({
                        username: claims.username,
                        avatarPath: user.avatarPath,
                    });
                }
                else {
                    res.statusCode = 200;
                    return res.json({
                        username: "",
                        avatarPath: "",
                    })
                }
            })
            .catch((err) => {
                res.statusCode = 500;
                return res.json({
                    message: err,
                });
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