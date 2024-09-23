import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "ProjectCategory",
        required: true,
    },
    introduction: {
        type: String,
        required: true,
    },
    problemStatement: {
        type: String,
        required: true,
    },
    requiredTechnology: {
        type: String,
        required: true,
    },
    softwareRequirement: {
        type: String,
        required: true,
    },
    hardwareRequirement: {
        type: String,
        required: true,
    },
    conclusion: {
        type: String,
        required: true,
    },
    references: {
        type: String,
        required: true,
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    }
}, { timestamps: true })

export const Project = mongoose.model("Project", ProjectSchema)
