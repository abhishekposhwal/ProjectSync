import mongoose, {Schema} from "mongoose";

const courseSchema = new Schema({
    name: {
        type : String, 
        required: true,
    },
    duration: {
        type : String,
        required: true,
    },
    description: {
        type : String,

    }
}, {timestamps:true})

export const Course = mongoose.model("Course",courseSchema)