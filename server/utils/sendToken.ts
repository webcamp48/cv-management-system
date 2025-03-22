import { Response } from "express";
import jwt from "jsonwebtoken";

export const sendToken = (user: any, statusCode: number, res: Response) => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("TOKEN SECRET is not defined in the environment variables.");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d", // Token expires in 1 day
    });

    // Set token in HTTP-only cookie
    res.cookie("authToken", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(statusCode).json({
        success: true,
        message: "Login successful!",
        token,
        user
    });
};
