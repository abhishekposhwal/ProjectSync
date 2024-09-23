import mongoose, { Schema } from "mongoose";

// Define the schema for Submissions
const SubmissionSchema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "approved", "rejected"], // Ensures the status is one of these values
        },
        mentorApproval: {
            type: String,
            enum: ["approved", "rejected", "pending"], // Ensures the mentorApproval is one of these values
            default: "pending",
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create the model for Submissions
export const Submission = mongoose.model("Submission", SubmissionSchema);
