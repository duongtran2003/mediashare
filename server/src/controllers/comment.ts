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
        const io = req.app.get('io');
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
                    Post.findOneAndUpdate({ _id: post_id }, { $inc: { comments: 1 } }, { new: true })
                        .then((post) => {
                            if (post) {
                                res.statusCode = 200;
                                io.emit('user-comment', {
                                    post_id: post._id,
                                    comment: {
                                        username: comment.username,
                                        content: comment.content,
                                    },
                                    postComments: post.comments,
                                })
                                return res.json({
                                    message: "success",
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