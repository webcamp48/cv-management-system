import express from 'express';
import { createCV, deleteCV, getAllCV, getSingleCV, updateCV } from '../controllers/cvController';
import { isAuthenticated } from '../middleware/authMiddleware';
const cvRouter = express.Router();

cvRouter.post("/create-cv", isAuthenticated, createCV);
cvRouter.get("/get-single-cv/:cvId", isAuthenticated, getSingleCV);
cvRouter.put("/update-cv/:cvId", isAuthenticated, updateCV);
cvRouter.get("/get-all-cv", isAuthenticated, getAllCV);
cvRouter.delete("/delete-cv/:cvId",isAuthenticated, deleteCV);


export default cvRouter;