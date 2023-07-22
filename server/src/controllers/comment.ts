import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Post } from '../models/Post';

class CommentController {
    queryComment(req: Request, res: Response) {
        const post_id = req.body.post_id;
        Comment.find({ post_id: post_id }, "username content")
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
        const content = req.body.content.trim();
        if (content == "") {
            res.statusCode = 400;
            return res.json({
                message: "Bad request",
            });
        }
        const post_id = req.body.post_id;
        Comment.create({
            username: username,
            post_id: post_id,
            content: content,
        })
            .then((comment) => {
                if (comment) {
                    console.log(post_id);
                    Post.findOneAndUpdate({ _id: post_id }, { $inc: { comments: 1 } }, { new: true })
                        .then((post) => {
                            if (post) {
                                res.statusCode = 200;
                                return res.json({
                                    username: comment.username,
                                    content: comment.content,
                                    comments: post.comments,
                                });
                            }
                            else {
                                console.log(post);
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