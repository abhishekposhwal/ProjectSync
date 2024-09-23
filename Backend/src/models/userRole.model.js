import mongoose, {Schema} from "mongoose";

const userRoleSchema = new Schema({
    role: {
        type : String,
        enum: ["admin","student","hod", "teacher"],
        required: true,
    },
}, {timestamps:true})

export const UserRole = mongoose.model("UserRole",userRoleSchema)