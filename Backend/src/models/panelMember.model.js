import mongoose, { Schema } from "mongoose";

// Define the Panel schema
const panelMemberSchema = new Schema(
    {
        panelId: {
            type: Schema.Types.ObjectId,
            ref: "Panel", // Reference to the User model
            required: true, // User ID is required
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true, // User ID is required
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the Panel model
export const PanelMember = mongoose.model("PanelMember", panelMemberSchema);
