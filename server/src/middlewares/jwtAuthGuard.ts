import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function authGuard(req: Request, res: Response, next: NextFunction) {
    const userToken = req.cookies["jwt"];
    if (!userToken) {
        res.statusCode = 401;
        return res.json({
            message: "No token",
        });
    }
    const claims = jwt.verify(req.cookies["jwt"], process.env.JWT_SECRET!);
    if (!claims) {
        res.statusCode = 401;
        return res.json({
            message: "Invalid token",
        });
    } 
    res.locals.claims = claims;
    next();
}

export {
    authGuard
}