import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema({
    submissionId: {
        type: Schema.Types.ObjectId,
        ref: "Submission",
    },
    facultyId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String, // Profile picture, ppt, synopsis etc
        required: true,
    }
}, { timestamps: true })

export const Feedback = mongoose.model("Feedback", feedbackSchema)