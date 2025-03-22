import mongoose, { Document, Schema, Model } from "mongoose";

interface IWorkExperience {
    jobTitle: string;
    companyName: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
}

interface IEducation {
    degree: string;
    institution: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
}

interface ICV extends Document {
    user: mongoose.Types.ObjectId;
    name : string;
    email: string;
    mobile: string;
    address: string;
    linkedInProfile?: string;
    githubProfile?: string;
    workExperience: IWorkExperience[];
    education: IEducation[];
}

const WorkExperienceSchema = new Schema<IWorkExperience>({
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
});

const EducationSchema = new Schema<IEducation>({
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
});

const CVSchema = new Schema<ICV>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        address: { type: String, required: true },
        linkedInProfile: { type: String },
        githubProfile: { type: String },
        workExperience: [WorkExperienceSchema],
        education: [EducationSchema],
    },
    { timestamps: true }
);

const CVModel: Model<ICV> = mongoose.model<ICV>("CV", CVSchema);
export default CVModel;
