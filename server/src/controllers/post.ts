import { Request, Response } from "express";
import { Post } from "../models/Post";
import mime from 'mime';
import { Vote } from "../models/Vote";
import { Comment } from "../models/Comment";
import fs from 'fs';
import mongoose from "mongoose";

class PostController {
    async topBatchQuery(req: Request, res: Response) {
        const excluded = req.body.excluded ? req.body.excluded : [];
        const batchSize = req.body.batchSize;
        const excludedID = excluded.map((id: string) => new mongoose.Types.ObjectId(id));
        const documents = await Post.aggregate([
            {
                $match: {
                    _id: { $nin: excludedID },
                    karma: { $gt: 5 }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    documents: { $push: '$$ROOT' }
                }
            },
            {
                $unwind: "$documents"
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1, "documents.karma": -1 },
            },
            {
                $limit: batchSize,
            },
            {
                $replaceRoot: { newRoot: '$documents' },
            }
        ]);
        return res.json(documents);
    }

    authBatchQuery(req: Request, res: Response) {}

    async index(req: Request, res: Response) {
        const queryByUsername = req.body.username;
        let posts = await Post.find({
            username: queryByUsername,
        });
        return res.json({
            message: "Query success",
            posts: posts,
        });
    }

    queryById(req: Request, res: Response) {
        const id = req.body.post_id;
        Post.findById(id)
            .then((post) => {
                if (post) {
                    res.statusCode = 200;
                    return res.json({
                        post: post,
                    })
                }
                else {
                    res.statusCode = 404;
                    return res.json({
                        message: "",
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

    async delete(req: Request, res: Response) {
        const username = res.locals.claims.username;
        const post_id = req.body.post_id;
        const post = await Post.findOneAndDelete({ username: username, _id: post_id });
        if (post) {
            //too complicated, not gonna emit anything with this one
            await Vote.deleteMany({ post_id: post_id });
            await Comment.deleteMany({ post_id: post_id });
            const fileToDelete = post.filename;
            fs.unlink(`./public/${fileToDelete}`, (err) => {
                console.log(err);
            });
            res.statusCode = 200;
            return res.json({
                message: "success",
                post_id: post_id,
            })
        }
        else {
            res.statusCode = 404;
            return res.json({
                message: "post not found",
            })
        }
    }
}

export {
    PostController
}