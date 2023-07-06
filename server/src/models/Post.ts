import mongoose, { Schema, model } from "mongoose";

interface IPost {
    title: string,
    content: string,
    user: string,
}

const postSchema = new Schema<IPost> ({
    title: {
        type: String,
    }, 
    content: {
        type: String,
    },
    user: {
        type: String,
    }
});

const Post = model("Post", postSchema);

export {
    Post,
}