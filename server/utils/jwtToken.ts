import dotenv from "dotenv";
dotenv.config();
import JWT, { Secret } from "jsonwebtoken";

import { EXPIRES_TOKEN_IN_HOURS } from "../constants/constant";


// Create JWT Token Function & now we save user and otp data in JWT 
export const createJwtToken = (user: any, activationOtp: string) => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("TOKEN SECRET is not defined in the environment variables.");
    }
    
    const token = JWT.sign(
        { user, activationOtp },
        process.env.JWT_SECRET_KEY as Secret,
        { expiresIn: EXPIRES_TOKEN_IN_HOURS || "2h" } 
    );

    return token;
};
