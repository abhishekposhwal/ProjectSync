import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/gorupMember.model.js";
import mongoose from "mongoose";
import { UserProfile } from "../models/userProfile.model.js";
import { User } from "../models/user.model.js";
import { UserRole } from "../models/userRole.model.js";

const registerUserProfile = asyncHandler(async (req, res) => {
    const {
        rollNumber,
        section,
        course,
        department,
        academicYear,
        roleDuringProject,
        areasOfExpertise,
        experience,
    } = req.body;

    const userRoleId = req.user.user_role; // Assuming user role is stored in req.user.user_role

    // Check if user role ID is valid
    if (!isValidObjectId(userRoleId)) {
        throw new ApiError(400, "Invalid user role id");
    }

    const userRole = await UserRole.findById(userRoleId);

    // Check if user role exists
    if (!userRole) {
        throw new ApiError(400, "User role does not exist");
    }

    if (!department) {
        throw new ApiError(400, "Department is required.");
    }
    // Validation based on user role
    if (userRole.role === "student") {
        if (!rollNumber) {
            throw new ApiError(400, "Roll number is required for students");
        }
        if (!academicYear) {
            throw new ApiError(400, "Academic year is required for students");
        }
        if (!section) {
            throw new ApiError(400, "Section is required for students");
        }
        if (!course) {
            throw new ApiError(400, "Course is required for students");
        }
        if (!roleDuringProject) {
            throw new ApiError(400, "Role during project is required for students");
        }

    } else if (userRole.role === "teacher") {
        if (!areasOfExpertise || !areasOfExpertise.length) {
            throw new ApiError(400, "Areas of expertise are required for teachers");
        }
        if (!experience) {
            throw new ApiError(400, "Experience is required for teachers");
        }
    } else {
        throw new ApiError(400, "Invalid user role");
    }

    // Check if user profile already exists
    const existingUserProfile = await UserProfile.findOne({ userId: req.user._id });
    if (existingUserProfile) {
        throw new ApiError(409, "User Profile already exists");
    }

    // Create user profile object based on the user role
    let newUserProfileData = {
        userId: req.user._id,
        department,
    };

    if (userRole.role === "student") {
        newUserProfileData = {
            ...newUserProfileData,
            rollNumber,
            section,
            course,
            academicYear,
            roleDuringProject,
        };
    } else if (userRole.role === "teacher") {
        newUserProfileData = {
            ...newUserProfileData,
            areasOfExpertise,
            experience,
        };
    }

    // Create user profile
    const newUserProfile = await UserProfile.create(newUserProfileData);

    let createdUserProfile;
    // Fetch the created user from the database excluding sensitive fields
    if (userRole.role === "student") {
        createdUserProfile = await UserProfile.findById(newUserProfile._id).select(
            "-areasOfExpertise"
        )
    } else if (userRole.role === "teacher") {
        createdUserProfile = await UserProfile.findById(newUserProfile._id)
    }

    if (!createdUserProfile) {
        throw new ApiError(500, "Something went wrong while registering the user profile")
    }

    // Return success response
    res.status(200).json(new ApiResponse(200, createdUserProfile, "Created User Profile successfully"));
});

// get all group member for a group
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Check if user ID is valid
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    // Find user by ID
    const user = await UserProfile.findOne({
        $or: [{ userId }]
    })

    // If user does not exist, throw error
    if (!user) {
        throw new ApiError(404, "User profile not found");
    }

    // Aggregate query to fetch user profile with department, course, and area of expertise details
    const userProfileAggregate = await UserProfile.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "departmentDetails",
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "courseDetails",
            },
        },
        {
            $lookup: {
                from: "projectcategories",
                localField: "areasOfExpertise",
                foreignField: "_id",
                as: "areasOfExpertiseDetails",
            },
        },
        {
            $addFields: {
                departmentName: { $first: "$departmentDetails.name" },
                courseName: { $first: "$courseDetails.name" },
                areasOfExpertise: "$areasOfExpertiseDetails.name",
            },
        },
        {
            $project: {
                rollNumber: 1,
                section: 1,
                departmentName: 1,
                department: 1,
                courseName: 1,
                course: 1,
                areasOfExpertise: 1,
                experience: 1,
                roleDuringProject: 1,
                academicYear: 1,
            },
        },
    ]);

    // Respond with the fetched user profile
    return res
        .status(200)
        .json(new ApiResponse(200, userProfileAggregate[0], "User profile fetched successfully"));
});

// Update a user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { userProfileId } = req.params;

    // Check if user profile ID is valid
    if (!isValidObjectId(userProfileId)) {
        throw new ApiError(400, "Invalid user profile id");
    }

    const {
        rollNumber,
        section,
        course,
        department,
        academicYear,
        roleDuringProject,
        areasOfExpertise,
        experience,
    } = req.body;

    console.log({
        rollNumber,
        section,
        course,
        department,
        academicYear,
        roleDuringProject,
        areasOfExpertise,
        experience,
    });
    const userRoleId = req.user.user_role; // Assuming user role is stored in req.user.user_role

    // Check if user role ID is valid
    if (!isValidObjectId(userRoleId)) {
        throw new ApiError(400, "Invalid user role id");
    }

    const userRole = await UserRole.findById(userRoleId);
    // Check if user role exists
    if (!userRole) {
        throw new ApiError(400, "User role does not exist");
    }

    // Find the profile by ID
    const existingProfile = await UserProfile.findById(userProfileId);

    // Check if profile exists
    if (!existingProfile) {
        throw new ApiError(404, "User profile not found");
    }

    // Create user profile object based on the user role
    let newUserProfileData = {
        department,
    };


    if (userRole.role === "student") {
        newUserProfileData = {
            ...newUserProfileData,
            rollNumber,
            section,
            course,
            academicYear,
            roleDuringProject,
        };
    } else if (userRole.role === "teacher") {
        newUserProfileData = {
            ...newUserProfileData,
            areasOfExpertise,
            experience,
        };
    }

    try {
        const updatedUserProfile = await UserProfile.findByIdAndUpdate(
            userProfileId,
            newUserProfileData,
            { new: true }
        );

        if (!updatedUserProfile) {
            throw new ApiError(500, "Something went wrong while updating the user profile");
        }

        // Return success response
        res.status(200).json(new ApiResponse(200, updatedUserProfile, "User Profile successfully updated"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating the user profile");
    }
});


export {
    registerUserProfile,
    getUserProfile,
    updateUserProfile,
};
