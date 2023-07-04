import express, { Request, Response } from 'express'
import { router as route } from './routes/index';
import { connect as dbConnect } from '../config/db';

let app = express();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(route);
app.listen('8000', () => {
    console.log("server's running");
});