import { Request, Response } from "express";
import CVModel from "../models/cvModel";

// ========================= 01  create a CV =============================
// =====================================================================
export const createCV = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { mobile, address, linkedInProfile, githubProfile, workExperience, education } = req.body;
        const newCV = new CVModel({
            user: userId,
            name: req.user?.name,
            email: req.user?.email,
            mobile,
            address,
            linkedInProfile,
            githubProfile,
            workExperience,
            education,
        });
        await newCV.save();
        res.status(201).json({success : true, message: "CV created successfully", cv : newCV });
    } catch (error:any) {
        return res.status(500).json({success : false, message: "Server error", error });
    }
}

// ========================= 02 get Single CV =============================
// =====================================================================

export const getSingleCV = async (req : Request, res : Response) => {
    try {
        const {cvId} = req.params;
        const cv = await CVModel.findById(cvId);
        if(!cv) {
            return res.status(404).json({success : false, message: "CV not found"})
        }
        res.status(200).json({success : true, message: "CV found successfully", cv})
    } catch (error:any) {
        return res.status(500).json({success : false, message: "Server error", error });
    }
}

// ========================= 03 get all CV =============================
// =====================================================================
export const getAllCV = async (req : Request, res : Response) => {
    try {
        const userId = req.user?._id; 

        const cvs = await CVModel.find({ user: userId }); 

        if (!cvs || cvs.length === 0) {
            return res.status(404).json({ success: false, message: "No CV found for this user" });
        }

        res.status(200).json({ success: true, message: "CVs retrieved successfully", cvs });
    } catch (error:any) {
        return res.status(500).json({success : false, message: "Server error", error });
    }
}

// ========================= 04  update a CV =============================
// =====================================================================
export const updateCV = async (req : Request, res : Response) => {
    try {
        const {cvId} = req.params;
        const cv = await CVModel.findByIdAndUpdate(cvId, req.body, {new : true});
        if(!cv) {
            return res.status(404).json({success : false, message: "CV not found"});
        }
        res.status(200).json({success : true, message: "CV updated successfully", cv});
    } catch (error:any) {
        return res.status(500).json({success : false, message: "Server error", error });
    }
}


// ========================= 05  delete a CV =============================
// =====================================================================
export const deleteCV = async (req: Request, res: Response) => {
    try {
        const {cvId} = req.params;
        const cv = await CVModel.findByIdAndDelete(cvId);
        if(!cv) {
            return res.status(404).json({success : false, message: "CV not found"});
        }
        res.status(200).json({success : true, message: "CV deleted successfully"});
    } catch (error:any) {
        return res.status(500).json({success : false, message: "Server error", error });
    }
}
