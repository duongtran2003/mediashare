import { Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Post } from '../models/Post';
import { Notification } from '../models/Notification';
import { Friend } from '../models/Friend';

class CommentController {
    queryComment(req: Request, res: Response) {
        const post_id = req.body.post_id;
        Comment.find({ post_id: post_id, parent_id: 0})
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

    async queryChildComment(req: Request, res: Response) {
        const parent_id = req.body.parent_id;
        const allComments = [];
        const queue = [];
        const comments = await Comment.find({ parent_id: parent_id });
        for (let comment of comments) {
            allComments.push(comment);
            queue.push(comment);
        }
        while (queue.length) {
            const parentComment: any = queue.pop();
            const comments = await Comment.find({ parent_id: parentComment!._id }); //cannot be undefined because queue.length has to be > 0
            for (let comment of comments) {
                allComments.push(comment);
                queue.push(comment);
            }
        }
        res.statusCode = 200;
        return res.json({
            comments: allComments,
        });
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
        const parent_id = req.body.parent_id ? req.body.parent_id : 0;
        const post = await Post.findOneAndUpdate({ _id: post_id }, { $inc: { comments: 1 } }, { new: true });
        if (post) {
            const comment = await Comment.create({
                parent_id: parent_id,
                username: username,
                post_id: post_id,
                content: content,
            });
            if (comment) {
                const friend = await Friend.findOne({ $or: [{ source: comment.username, target: post.username }, { source: post.username, target: comment.username }] });
                const noti = friend ? await Notification.create({
                    source: comment.username,
                    target: post.username,
                    message: `${comment.username} has commented on your post`,
                    status: "unseen",
                    segs: '/post',
                    dest: post._id,
                }) : null;
                res.statusCode = 200;
                io.emit('user-comment', {
                    noti_id: noti ? noti._id : "",
                    post_id: post._id,
                    comment: {
                        _id: comment._id,
                        username: comment.username,
                        content: comment.content,
                        parent_id: comment.parent_id,
                        createdAt: comment.createdAt,
                        updatedAt: comment.updatedAt,
                    },
                    message: noti ? noti.message : "",
                    createdAt: noti ? noti.createdAt : "",
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
            res.statusCode = 404;
            return res.json({
                message: "Post not found",
            })
        }
    }

    async delete(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const comment_id = req.body.comment_id;
        const comment = await Comment.findOneAndUpdate({ username: username, _id: comment_id }, { content: '[deleted]' }, { new: true });
        if (comment) {
            const post = await Post.findOne({ _id: comment.post_id });
            if (post) {
                req.app.get('io').emit('comment-delete', {
                    post_id: post._id,
                    comment_id: comment._id,
                    content: comment.content,
                    username: comment.username,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt, 
                });
                res.statusCode = 200;
                return res.json({
                    message: "success",
                })
            }
            else {
                res.statusCode = 404;
                return res.json({
                    message: "Post not found",
                })
            }
        }
        else {
            res.statusCode = 404;
            return res.json({
                message: "Comment not found",
            })
        }
    }

    async edit(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const comment_id = req.body.comment_id;
        const newContent = req.body.content;
        const comment = await Comment.findOneAndUpdate({ username: username, _id: comment_id }, { content: newContent }, { new: true });
        if (comment) {
            req.app.get('io').emit('comment-edit', {
                comment_id: comment._id,
                post_id: comment.post_id,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            });
            res.statusCode = 200;
            return res.json({
                message: "success",
            })
        } 
        else {
            res.statusCode = 404;
            return res.json({
                message: "Comment not found",
            })
        }
    }
}

export {
    CommentController
}