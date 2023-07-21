import { Response, Request } from 'express';
import { Vote } from '../models/Vote';
import { Post } from '../models/Post';

class VoteController {
    async votePost(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        const type = req.body.type;
        let foundPost = 0;
        let karma = 0;
        const point = type;
        await Post.findOneAndUpdate({ _id: post_id }, { $inc: { karma: point } }, { new: true })
            .then((post) => {
                if (post) {
                    foundPost = 1;
                    karma = post.karma;
                    console.log(post);
                }
                else {
                    foundPost = 0;
                }
            })
            .catch((err) => {
                foundPost = 0;
            });
        if (foundPost) {
            Vote.create({
                username: username,
                post_id: post_id,
                type: type,
            })
                .then((vote) => {
                    if (vote) {
                        res.statusCode = 200;
                        return res.json({
                            username: vote.username,
                            post_id: vote.post_id,
                            type: vote.type,
                            karma: karma,
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
        else {
            res.statusCode = 404;
            return res.json({
                message: "Post not found."
            });
        }
    }

    async changeVote(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        const type = req.body.type;
        let foundPost = 0;
        let point = 0;
        let karma = 0;
        if (type == 1) {
            point = 2;
        }
        if (type == -1) {
            point = -2;
        }
        await Post.findOneAndUpdate({ _id: post_id }, { $inc: { karma: point } }, { new: true })
            .then((post) => {
                if (post) {
                    foundPost = 1;
                    karma = post.karma;
                }
                else {
                    foundPost = 0;
                }
            })
            .catch((err) => {
                foundPost = 0;
            });
        if (foundPost) {
            Vote.findOneAndUpdate({
                username: username,
                post_id: post_id,
            }, { type: type })
                .then((vote) => {
                    if (vote) {
                        res.statusCode = 200;
                        return res.json({
                            username: vote.username,
                            post_id: vote.post_id,
                            type: vote.type,
                            karma: karma,
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
        else {
            res.statusCode = 404;
            return res.json({
                message: "Post not found."
            });
        }
    }

    async removeVote(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        const type = req.body.type;
        let point = 0;
        if (type == 1) {
            point = -1;
        }
        else {
            point = 1;
        }
        let karma = 0;
        let foundPost = 0;
        await Post.findOneAndUpdate({ _id: post_id }, { $inc: { karma: point } }, { new: true })
            .then((post) => {
                if (post) {
                    foundPost = 1;
                    karma = post.karma;
                }
                else {
                    foundPost = 0;
                }
            })
            .catch((err) => {
                foundPost = 0;
            })
        if (foundPost) {
            Vote.findOneAndDelete({ username: username, post_id: post_id })
                .then((vote) => {
                    if (vote) {
                        res.statusCode = 200;
                        return res.json({
                            username: vote.username,
                            post_id: vote.post_id,
                            type: vote.type,
                            karma: karma,
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