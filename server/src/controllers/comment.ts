import { Request, Response } from 'express';
import { Comment } from '../models/Comment';

class CommentController {
    queryComment(req: Request, res: Response) {
        const post_id = req.body.post_id;
        Comment.find({ post_id: post_id })
        .then((comments) => {
            res.statusCode = 200;
            return res.json({
                comments: comments,
            });
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
        const content = req.body.content;
        const post_id = req.body.post_id;
        Comment.create({
            username: username,
            post_id: post_id,
            content: content,
        })
        .then((comment) => {
            if (comment) {
                res.statusCode = 200;
                return res.json({
                    username: comment.username,
                    post_id: comment.post_id,
                    content: comment.content,
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
                message: "Server's error",
            })
        })
    }
}

export {
    CommentController
}