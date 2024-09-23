import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    }
}, { timestamps: true })

export const Department = mongoose.model("Department", departmentSchema)