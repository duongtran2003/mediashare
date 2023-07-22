import express, { Request, Response } from 'express'
import { router as route } from './routes/index';
import { connect as dbConnect } from '../config/db';
import cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
import cors from 'cors';
import io from 'socket.io';

let app = express();
dbConnect();

app.use('/static', express.static('public'));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: true,
}));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(route);
let server = app.listen('8000', () => {
    console.log("server's running");
});

let ioInstance = new io.Server(server);
app.set('io', ioInstance);