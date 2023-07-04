import mongoose, { Schema, model } from "mongoose";
interface IUser {
    email: string,
    username: string,
    password: string,
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
    }
});

const User = model<IUser> ('User', userSchema);

export {
    User
}