import { Request,Response } from "express";

import dotenv from "dotenv";
dotenv.config();
import path from "path";
import ejs from "ejs";
import JWT from "jsonwebtoken";

import { IUser, User } from "../models/userModel";
import { generateOtp } from "../utils/generateOtp";
import { createJwtToken } from "../utils/jwtToken";
import { ADMIN_EMAIL, EXPIRES_TOKEN_IN_HOURS } from "../constants/constant";
import sendMail from "../services/email/sendMail";
import { sendToken } from "../utils/sendToken";



// ====================|| 1. Registration User  ||====================
// =================================================================


//Registration User Interface
interface userRegistrationBody {
    name: string;
    email: string;
    password: string;
}

export const registrationUser = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body as userRegistrationBody;
        const isEmailExist = await User.findOne({email});
        if (isEmailExist) {
            return res.status(400).json({message: "Email already exist"});
        }

        // Create new user
        const user : userRegistrationBody = ({
            name,
            email,
            password,
        });

        // Generate OTP (Activation Code)
        const emailOtp = generateOtp();

        // Create Token including activationOtp
        const token = createJwtToken(user, emailOtp);

        // Prepare email ejs data
        const data = {
            user : user.name,
            emailOtp,
            EXPIRES_TOKEN_IN_HOURS,
            ADMIN_EMAIL,
        };

        // Render email template
        const emailTemplate = await ejs.renderFile(path.join(__dirname, "../services/ejs/activation-mail.ejs"), data);

        // Send activation email asynchronously (run background task)
        sendMail({
            email : user.email,
            subject : "Activation Email",
            template : emailTemplate,
            data
        }).catch((error : any)=> {
            console.log(error);
        });

        // Return response without waiting for email to send
        return res.status(200).json({success : true, activation_token : token, message : `Activation email sent to ( ${user.email}). Please check your inbox. `});

    } catch (error:any) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// ====================|| 2. Activate User | Verify User  ||====================
// ===========================================================================

// activate user through OTP and token
interface IVerifyRequest {
    activation_otp : string;  //email otp
    activation_token : string;
}

export const VerifyUser = async (req:Request,res:Response) => {
    try {
        const {activation_otp, activation_token} = req.body as IVerifyRequest;

        if (!activation_token) {
            return res.status(400).json({ success: false, message: "Activation token is required" });
        }

        // Verify JWT to retrieve user and OTP
        const decoded : {user: IUser; activationOtp : string} = JWT.verify(
            activation_token,
            process.env.JWT_SECRET_KEY as string
        ) as { user: IUser; activationOtp: string };

        // Compare provided OTP with the user token's OTP
        if (activation_otp !== decoded.activationOtp) {
            return res.status(400).json({success : false, message : "Invalid OTP"});
        }

        const {name, email, password} = decoded.user;
        const existUser = await User.findOne({email});
        if (existUser) {
            return res.status(400).json({success : false, message : "User already exists"});
        }

        // now Create and save the user in DB after enter otp and verify user
        const user = await User.create({
            name,
            email,
            password,
        });
        await user.save(); 


        res.status(200).json({success : true, message : "Account Activated Successfully"});
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// ====================|| 3. Login User Handler   ||=========================
// ========================================================================

interface ILoginRequest {
    email: string;
    password: string;
}

export const LoginUser = async (req:Request, res :Response)=> {
    try {
        const {email, password} = req.body as ILoginRequest;
        const user = await User.findOne({email}).select("+password");
        if (!user) {
            return res.status(400).json({success : false, message : "Invalid Email or Password"});
        }
        const isMatchPassword = await user.comparePassword(password);
        if (!isMatchPassword) {
            return res.status(400).json({success : false, message : "Incorrect Password"})
        }

        // send access & refresh token to user in login time
        sendToken(user, 200, res);

    } catch (error:any) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// ====================|| 10. getCurrentUserInfo ||====================
// ==========================================================================

export const getCurrentUserInfo = async (req:Request, res:Response) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({success : false, message : "User not found"})
        }
        res.status(200).json({ success: true , message : `${user.name} User Info..`, user });
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// ====================|| 4. logout User Handler   ||=========================
// =========================================================================
export const LogoutUser = async (req: Request, res: Response) => {
    try {
        // Clear the authToken cookie
        res.cookie("authToken", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// ===========================||  END ||==========================
// ===================================================================
