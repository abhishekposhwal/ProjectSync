import mongoose, { Schema } from "mongoose";

const groupMemberSchema = new Schema({
    group_id: {
        type: Schema.Types.ObjectId,
        ref: "Group", // Reference to the Group model
        required: true, // Group ID is required
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true, // User ID is required
    },
    member_role: {
        type: String,
        required: true, // Member role is required
    }
}, { timestamps: true }) // Automatically add createdAt and updatedAt timestamps

// Create the GroupMember model based on the schema
export const GroupMember = mongoose.model("GroupMember", groupMemberSchema)

