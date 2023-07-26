import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { Notification } from '../models/Notification';

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

    async create(req: Request, res: Response) {
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

        const post = await Post.findOneAndUpdate({ _id: post_id }, { $inc: { comments: 1 } }, { new: true });
        if (post) {
            const comment = await Comment.create({
                username: username,
                post_id: post_id,
                content: content,
            });
            if (comment) {
                const noti = await Notification.create({
                    source: comment.username,
                    target: post.username,
                    message: `${comment.username} has commented on your post`,
                    status: "unseen",
                    segs: '/post',
                    dest: post._id,
                }) 
                res.statusCode = 200;
                io.emit('user-comment', {
                    noti_id: noti._id,
                    post_id: post._id,
                    comment: {
                        username: comment.username,
                        content: comment.content,
                    },
                    message: noti.message,
                    postComments: post.comments,
                    target: post.username,
                });
                return res.json({
                    message: "success",
                })
            }
            else {
                res.statusCode = 500;
                return res.json({
                    message: "Server's error",
                })
            }
        }        
        else {
            res.statusCode = 500;
            return res.json({
                message: "Server's error",
            })
        }
    }
}

export {
    CommentController
}