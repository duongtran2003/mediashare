import { Request, Response } from "express";
import { Post } from "../models/Post";
import mime from 'mime';

class PostController {
    async index(req: Request, res: Response) {
        const queryByUsername = req.body.username;
        let posts = await Post.find({
            username: queryByUsername,
        }, "title filename username fileType karma _id comments");
        return res.json({
            message: "Query success",
            posts: posts,
        });
    }

    queryById(req: Request, res: Response) {
        const id = req.body.post_id;
        Post.findById(id, "title filename username fileType karma _id comments")
        .then((post) => {
            if (post) {
                res.statusCode = 200;
                return res.json({
                    post: post,
                })
            }
            else {
                res.statusCode = 400;
                return res.json({
                    message: "Bad request",
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

    create(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const filename = req.file?.filename;
        const title = req.body.title.trim();
        if (title == "") {
            res.statusCode = 400;
            return res.json({
                message: "Bad request",
            })
        }
        let ext: string = "";
        const fileExtension: string = <string>mime.getExtension(req.file!.mimetype);
        if (fileExtension == 'mp4') {
            ext = 'video';
        }
        else {
            ext = 'picture'
        }
        const newPost = {
            title: title,
            filename: filename,
            fileType: ext,
            username: username,
            karma: 0,
            comments: 0,
        }
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
                        comments: post.comments,
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