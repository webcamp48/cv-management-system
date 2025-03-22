import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

import cookieParser from "cookie-parser";
import userRouter from './routes/userRoute';
import cvRouter from "./routes/cvRoute";

export const app = express();

app.use(express.urlencoded({ extended: true }));
// body parser
app.use(express.json({ limit: '50mb' }));

app.use(cookieParser());

// mongodb Database 
connectDB();

// cors
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE, PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));



//API Routes
app.use("/api/user", userRouter);
app.use("/api/cv", cvRouter);


// Unknown route handler
app.all("*", (req: Request, res : Response, next:NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    error.statusCode = 404;
    next(error);
});
