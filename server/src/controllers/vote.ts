import { Response, Request } from 'express';
import { Vote } from '../models/Vote';
import { Post } from '../models/Post';
import { Notification } from '../models/Notification';
import { Friend } from '../models/Friend';

class VoteController {
    async votePost(req: Request, res: Response) {
        const io = req.app.get('io');
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        const type = req.body.type;
        let foundPost = 0;
        let karma = 0;
        let op = "";
        const point = type;
        let post = await Post.findOneAndUpdate({ _id: post_id }, { $inc: { karma: point } }, { new: true });
        if (post) {
            foundPost = 1;
            op = post.username;
            karma = post.karma;
        }
        else {
            foundPost = 0;
        }
        if (foundPost) {
            const vote = await Vote.create({
                username: username,
                post_id: post_id,
                type: type,
            });
            if (vote) {
                res.statusCode = 200;
                const friend = await Friend.findOne({ $or: [{ source: vote.username, target: post!.username }, { source: post!.username, target: vote.username }] });
                const noti = friend ? await Notification.create({
                    source: vote.username,
                    target: op,
                    message: vote.type == 1 ? `${vote.username} has upvoted your post` : `${vote.username} has downvoted your post`,
                    status: "unseen",
                    segs: '/post',
                    dest: vote.post_id,
                }) : null;
                io.emit('user-vote', {
                    noti_id: noti ? noti._id : "",
                    post_id: vote.post_id,
                    op: op,
                    karma: karma,
                    username: vote.username,
                    voteType: vote.type,
                    createdAt: noti ? noti.createdAt : "",
                    updatedAt: noti ? noti.updatedAt : "",
                });
                res.statusCode = 200;
                return res.json({
                    message: "success",
                });
            }
            else {
                res.statusCode = 500;
                return res.json({
                    message: "Server's error",
                });
            }
        }
        else {
            res.statusCode = 404;
            return res.json({
                message: "post not found",
            })
        }
    }

    async changeVote(req: Request, res: Response) {
        const io = req.app.get('io');
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        const type = req.body.type;
        let foundPost = 0;
        let op = "";
        let point = 0;
        let karma = 0;
        if (type == 1) {
            point = 2;
        }
        if (type == -1) {
            point = -2;
        }
        const post = await Post.findOneAndUpdate({ _id: post_id }, { $inc: { karma: point } }, { new: true });
        if (post) {
            foundPost = 1;
            karma = post.karma;
            op = post.username;
        }
        else {
            foundPost = 0;
        }
        if (foundPost) {
            const vote = await Vote.findOneAndUpdate({ username: username, post_id: post_id }, { type: type }, { new: true });
            if (vote) {
                const friend = await Friend.findOne({ $or: [{ source: vote.username, target: post!.username }, { source: post!.username, target: vote.username }] });
                const noti = friend ? await Notification.create({
                    source: vote.username,
                    target: op,
                    message: vote.type == 1 ? `${vote.username} has upvoted your post` : `${vote.username} has downvoted your post`,
                    status: "unseen",
                    segs: '/post',
                    dest: vote.post_id,
                }) : null;
                io.emit('user-vote', {
                    noti_id: noti ? noti._id : "",
                    post_id: vote.post_id,
                    op: op,
                    karma: karma,
                    username: vote.username,
                    voteType: vote.type,
                    createdAt: noti ? noti.createdAt : "",
                    updatedAt: noti ? noti.updatedAt : "",
                });
                res.statusCode = 200;
                return res.json({
                    message: "success",
                });
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
                message: "Post not found."
            });
        }
    }

    async removeVote(req: Request, res: Response) {
        const io = req.app.get('io');
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        const type = req.body.type;
        let op = "";
        let point = 0;
        if (type == 1) {
            point = -1;
        }
        else {
            point = 1;
        }
        let karma = 0;
        let foundPost = 0;
        const post = await Post.findOneAndUpdate({ _id: post_id }, { $inc: { karma: point } }, { new: true });
        if (post) {
            foundPost = 1;
            karma = post.karma;
            op = post.username;
        }
        else {
            foundPost = 0;
        }
        if (foundPost) {
            const vote = await Vote.findOneAndDelete({ username: username, post_id: post_id });
            if (vote) {
                io.emit('user-vote', {
                    post_id: vote.post_id,
                    karma: karma,
                    op: op,
                    username: vote.username,
                    voteType: 0,
                });
                res.statusCode = 200;
                return res.json({
                    message: "success",
                });
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
                message: "Post not found."
            });
        }
    }

    getUserVote(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        Vote.findOne({ username: username, post_id: post_id })
            .then((vote) => {
                if (vote) {
                    res.statusCode = 200;
                    return res.json({
                        username: vote.username,
                        post_id: vote.post_id,
                        type: vote.type,
                    });
                }
                else {
                    res.statusCode = 404;
                    return res.json({
                        message: "no vote",
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
    VoteController,
}