import { Response, Request } from 'express';
import { Vote } from '../models/Vote';
import { Post } from '../models/Post';

class VoteController {
    async votePost(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        const type = req.body.type;
        let foundPost = 0;
        await Post.findOneAndUpdate({ _id: post_id }, { $inc: { karma: 1 } })
            .then((post) => {
                if (post) {
                    foundPost = 1;
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
        Vote.find({ username: username })
            .then((votes) => {
                res.statusCode = 200;
                return res.json({
                    message: "vote query success",
                    votes: votes,
                });
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