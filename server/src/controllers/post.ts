import { Request, Response } from "express";
import { Post } from "../models/Post";
import mime from 'mime';

class PostController {
    async index(req: Request, res: Response) {
        const queryByUsername = res.locals.claims.username;
        let posts = await Post.find({
            username: queryByUsername,
        }, "title filename username fileType karma _id");
        return res.json({
            message: "Query success",
            posts: posts,
        });
    }

    create(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const filename = req.file?.filename;
        let ext: string = "";
        const fileExtension: string = <string>mime.getExtension(req.file!.mimetype);
        if (fileExtension == 'mp4') {
            ext = 'video';
        }
        else {
            ext = 'picture'
        }
        const newPost = {
            title: req.body.title,
            filename: filename,
            fileType: ext,
            username: username,
            karma: 0,
        }
        console.log(newPost);
        Post.create(newPost)
            .then((post) => {
                if (post) {
                    res.statusCode = 200;
                    return res.json({
                        _id: post._id,
                        title: post.title,
                        filename: post.filename,
                        fileType: ext,
                        username: post.username,
                        karma: post.karma,
                    })
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
                    message: "Server's error",
                })
            })
    }
}

export {
    PostController
}