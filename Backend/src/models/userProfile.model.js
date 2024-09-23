import mongoose, { Schema } from "mongoose";

// Define the schema for user profiles
const userProfileSchema = new Schema(
    {
        // Unique roll number assigned to the student
        rollNumber: {
            type: Number,
        },
        // Section in which the student is enrolled
        section: {
            type: String,
        },
        // Course in which the student is enrolled
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
        },
        // Department to which the student belongs
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        // Academic year in which the student is enrolled
        academicYear: {
            type: String,
        },
        // Role undertaken by the student during a project
        roleDuringProject: {
            type: String,
        },
        // Areas of expertise of the teacher
        areasOfExpertise: {
            type: Schema.Types.ObjectId,
            ref: "ProjectCategory",
        },
        // Years of experience of the teacher
        experience: {
            type: Number,
        },
        // User ID associated with the user profile
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        // Include timestamps for when the profile was created and updated
        timestamps: true,
    }
);

// Create a model based on the defined schema
export const UserProfile = mongoose.model("UserProfile", userProfileSchema)
