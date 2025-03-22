import dotenv from "dotenv";
dotenv.config();

import mongoose, { Schema, Document,Model } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;


  comparePassword(password: string): Promise<boolean>;
}

// user Schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Exclude password from queries
    },

  },{ timestamps: true }
);


// Middleware to hash the password before saving
userSchema.pre<IUser>('save', async function(next)  {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// compare user password and database password
userSchema.methods.comparePassword = async function(enterPassword: string) : Promise<boolean>{
    return await bcrypt.compare(enterPassword, this.password);
}

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
