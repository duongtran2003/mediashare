import mongoose, { Schema, model } from "mongoose";
interface IUser {
    email: string,
    username: string,
    password: string,
    avatarPath: string,
}

const userSchema = new Schema<IUser> ({
    email: {
        type: String, 
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    avatarPath: {
        type: String,
    },
});

const User = model<IUser> ('User', userSchema);

export {
    User
}