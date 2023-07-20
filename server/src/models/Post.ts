import mongoose, { Schema, model } from "mongoose";

interface IPost {
    title: string,
    filename: string,
    fileType: string,
    username: string,
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
    }
});

const Post = model("Post", postSchema);

export {
    Post,
}