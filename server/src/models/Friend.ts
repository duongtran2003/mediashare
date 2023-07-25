import { model, Schema } from "mongoose";

interface IFriend {
    source: string,
    target: string,
    status: string, /** active, pending */
}

const friendSchema = new Schema<IFriend> ({
    source: {
        type: String,
    },
    target: {
        type: String,
    },
    status: {
        type: String,
    },
});

const Friend = model<IFriend> ('Friend', friendSchema);

export {
    Friend,
}