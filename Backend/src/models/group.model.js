import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // User ID is required
    },
}, { timestamps: true })

export const Group = mongoose.model("Group", groupSchema)
