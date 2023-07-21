import mongoose, { Schema, model } from "mongoose";
interface IComment {
    username: string,
    post_id: string,
    content: string,
}

const commentSchema = new Schema<IComment> ({
    username: {
        type: String,
    },
    post_id: {
        type: String,
    },
    content: {
        type: String,
    }
});

const Comment = model<IComment> ('Comment', commentSchema);

export {
    Comment
}