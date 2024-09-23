import mongoose, {Schema} from "mongoose";

const ProjectCategorySchema = new Schema({
    name: {
        type : String, 
        required: true,
    },
    description: {
        type : String,
    },
}, {timestamps:true})

export const ProjectCategory = mongoose.model("ProjectCategory",ProjectCategorySchema)
