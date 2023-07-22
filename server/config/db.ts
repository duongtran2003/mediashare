import mongoose from "mongoose";

async function connect() {
    await mongoose.connect('mongodb://127.0.0.1:27017/mdshare')
    .then(() => {
        console.log("database connected");
    })
    .catch((err) => {
        console.log("error encountered while connecting to database: ", err);
    });
}

export {
    connect
}