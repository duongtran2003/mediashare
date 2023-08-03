import mongoose, { Schema, model } from "mongoose";
interface IComment {
    parent_id: string,
    username: string,
    post_id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
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
    },
    parent_id: {
        type: String,
    }
}, { timestamps: true });

const Comment = model<IComment> ('Comment', commentSchema);

export {
    Comment
}