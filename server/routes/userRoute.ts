import express from "express";
import { LoginUser, LogoutUser, registrationUser, VerifyUser, getCurrentUserInfo } from "../controllers/userController";
import { isAuthenticated } from "../middleware/authMiddleware";

const userRouter = express.Router();

// Auth Routes
userRouter.post("/register-user", registrationUser);
userRouter.post("/verify-user", VerifyUser);
userRouter.post("/login", LoginUser);
userRouter.get("/logout", isAuthenticated, LogoutUser);

// get current user Routes
userRouter.get("/get-current-user-info", isAuthenticated, getCurrentUserInfo)


export default userRouter;
