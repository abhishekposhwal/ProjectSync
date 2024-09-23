import mongoose, { Schema } from "mongoose";

const panelAssignedGroupSchema = new Schema({
    panelId: {
        type: Schema.Types.ObjectId,
        ref: "Panel",
    },
    // Reference to the assigned group
    assignedToGroup: {
        type: mongoose.Types.ObjectId,
        ref: "Group",
        required: true,
    },
}, { timestamps: true })

export const PanelAssignedGroup = mongoose.model("PanelAssignedGroup", panelAssignedGroupSchema)