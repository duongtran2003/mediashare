import mongoose, { Schema, model } from "mongoose";

interface IPost {
    title: string,
    filename: string,
    fileType: string,
    username: string,
    karma: number,
    comments: number,
}

const postSchema = new Schema<IPost> ({
    title: {
        type: String,
    }, 
    filename: {
        type: String,
    },
    fileType: {
        type: String,
    },
    username: {
        type: String,
    },
    karma: {
        type: Number,
    },
    comments: {
        type: Number,
    }
});

const Post = model("Post", postSchema);

export {
    Post,
}