import mongoose, { Schema } from "mongoose";

// Define the Panel schema
const panelSchema = new Schema(
    {
        // Panel name
        name: {
            type: String,
            required: true,
        },
        presentation: {
            type: String,
            required: true,
        }
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the Panel model
export const Panel = mongoose.model("Panel", panelSchema);
