import { Request, Response } from "express";
import { Post } from "../models/Post";

class PostController {
    async index(req: Request, res: Response) {
        const queryByUsername = res.locals.claims.username;
        let posts = await Post.find({
            user: queryByUsername,
        }, "title content user");
        return res.json({
            message: "Query success",
            posts: posts,
        });
    }

    create(req: Request, res: Response) {
        let newPost = {
            title: req.body.title,
            content: req.body.content,
            user: res.locals.claims.username,
        }

        Post.create(newPost)
        .then((post) => {
            return res.json({
                message: "New post added",
                title: post.title,
                content: post.content,
                user: post.user
            });
        })
        .catch((err) => {
            return res.json({
                message: "Server error",
            })
        });
    }
}

export {
    PostController
}