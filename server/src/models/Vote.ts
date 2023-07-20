import mongoose, { Schema, model } from "mongoose";
interface IVote {
    username: string,
    post_id: string,
    type: number,
}

const voteSchema = new Schema<IVote> ({
    username: {
        type: String,
    },
    post_id: {
        type: String,
    },
    type: {
        type: Number,
    }
});

const Vote = model<IVote> ('Vote', voteSchema);

export {
    Vote
}