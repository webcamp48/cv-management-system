import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/userModel";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authToken } = req.cookies;
        if (!authToken) {
            return res.status(401).json({ success: false, message: "You are Not authenticated! Please Login First" });
        }

        const decoded: any = jwt.verify(authToken, process.env.JWT_SECRET_KEY as string);
        req.user = await User.findById(decoded.id) as IUser;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
