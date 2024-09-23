import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/gorupMember.model.js";
import mongoose from "mongoose";
import { ProjectCategory } from "../models/projectCategory.model.js";
import { Project } from "../models/project.model.js";
import { Submission } from "../models/submission.model.js";

// Register a new project and associate it with a submission
const registerProjectDetails = asyncHandler(async (req, res) => {
    // Destructure the request body to get the project details
    const {
        title,
        projectCategoryId,
        introduction,
        problemStatement,
        requiredTechnology,
        softwareRequirement,
        hardwareRequirement,
        conclusion,
        references,
        groupId,
    } = req.body;

    // Validate that all required fields are present and not empty
    if (
        ![
            title,
            introduction,
            problemStatement,
            requiredTechnology,
            softwareRequirement,
            hardwareRequirement,
            conclusion,
            references,
        ].every((field) => field && field.trim() !== "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Validate the group ID
    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "Invalid group ID");
    }

    // Check if the group exists
    const existingGroup = await Group.findById(groupId);
    if (!existingGroup) {
        throw new ApiError(409, "Group not found");
    }

    // Validate the project category ID
    if (!isValidObjectId(projectCategoryId)) {
        throw new ApiError(400, "Invalid project category ID");
    }

    // Check if the project category exists
    const existingProjectCategory = await ProjectCategory.findById(projectCategoryId);
    if (!existingProjectCategory) {
        throw new ApiError(409, "Project category not found");
    }

    // Create new project details
    const newProject = await Project.create({
        title: title,
        category: projectCategoryId,
        introduction: introduction,
        problemStatement: problemStatement,
        requiredTechnology: requiredTechnology,
        softwareRequirement: softwareRequirement,
        hardwareRequirement: hardwareRequirement,
        conclusion: conclusion,
        references: references,
        groupId: groupId,
    });

    // Create a new submission for the project
    const newSubmission = await Submission.create({
        projectId: newProject._id,
    });

    // Append the submission ID to the project details (convert to a plain object)
    const projectWithSubmissionId = newProject.toObject();
    projectWithSubmissionId.submissionId = newSubmission._id;

    // Return a success response with the created project details
    res.status(201).json(
        new ApiResponse(201, projectWithSubmissionId, "Project details added successfully")
    );
});


// Fetch project details for a specific group
const getProjectDetails = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    // Validate the group ID
    if (!mongoose.isValidObjectId(groupId)) {
        throw new ApiError(400, "Invalid group ID");
    }

    // Check if the group exists
    const existingGroup = await Group.findById(groupId);
    if (!existingGroup) {
        throw new ApiError(404, "Group does not exist");
    }

    console.log("Group ID:", groupId);

    // Aggregate project details including submission, feedback, and category
    const projectDetails = await Project.aggregate([
        {
            $match: {
                groupId: new mongoose.Types.ObjectId(groupId),
            },
        },
        {
            $lookup: {
                from: "submissions",
                localField: "_id",
                foreignField: "projectId",
                as: "submissionDetails",
            },
        },
        {
            $lookup: {
                from: "feedbacks",
                localField: "submissionDetails._id",
                foreignField: "submissionId",
                as: "feedbackDetails",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "feedbackDetails.facultyId",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        {
            $lookup: {
                from: "projectcategories",
                localField: "category",
                foreignField: "_id",
                as: "projectCategoryDetails",
            },
        },
        {
            $lookup: {
                from: "groups",
                localField: "groupId",
                foreignField: "_id",
                as: "groupDetails",
            },
        },
        {
            $addFields: {
                submission: {
                    $arrayElemAt: ["$submissionDetails", 0],
                },
                feedback: {
                    $arrayElemAt: ["$feedbackDetails", 0],
                },
                category: {
                    $arrayElemAt: ["$projectCategoryDetails.name", 0]
                },
                faculty: {
                    $arrayElemAt: ["$userDetails.fullName", 0]
                },
                groupName: {
                    $arrayElemAt: ["$groupDetails.name", 0]
                }
            },
        },
        {
            $project: {
                groupId: 1,
                category: 1,
                title: 1,
                problemStatement: 1,
                introduction: 1,
                requiredTechnology: 1,
                softwareRequirement: 1,
                hardwareRequirement: 1,
                conclusion: 1,
                references: 1,
                submission: 1,
                createdAt: 1,
                groupName: 1,
                feedback: {
                    _id: "$feedback._id",
                    faculty: "$faculty",
                    comment: "$feedback.comment"
                },

            },
        },
    ]);

    // Check if any projects were found
    if (!projectDetails || projectDetails.length === 0) {
        throw new ApiError(404, "No project found for this group");
    }

    // Return success response with project details
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectDetails,
                "Project details fetched successfully"
            )
        );
});


// Fetch project details for a specific group
const getAllProjectDetails = asyncHandler(async (req, res) => {
    const projects = await Project.find();

    // Check if groups exist
    if (!projects.length) {
        throw new ApiError(404, "No project found");
    }
    // Aggregate project details including submission, feedback, and category
    const projectDetails = await Project.aggregate([
        {
            $lookup: {
                from: "groups",
                localField: "groupId",
                foreignField: "_id",
                as: "groupDetails",
            },
        },
        {
            $lookup: {
                from: "submissions",
                localField: "_id",
                foreignField: "projectId",
                as: "submissionDetails",
            },
        },
        {
            $lookup: {
                from: "feedbacks",
                localField: "submissionDetails._id",
                foreignField: "submissionId",
                as: "feedbackDetails",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "feedbackDetails.facultyId",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        {
            $lookup: {
                from: "projectcategories",
                localField: "category",
                foreignField: "_id",
                as: "projectCategoryDetails",
            },
        },
        {
            $addFields: {
                submission: {
                    $arrayElemAt: ["$submissionDetails", 0],
                },
                feedback: {
                    $arrayElemAt: ["$feedbackDetails", 0],
                },
                category: {
                    $arrayElemAt: ["$projectCategoryDetails.name", 0]
                },
                faculty: {
                    $arrayElemAt: ["$userDetails.fullName", 0]
                },
                groupName: {
                    $arrayElemAt: ["$groupDetails.name", 0]
                }
            },
        },
        {
            $project: {
                groupId: 1,
                groupName: 1,
                category: 1,
                title: 1,
                problemStatement: 1,
                introduction: 1,
                requiredTechnology: 1,
                softwareRequirement: 1,
                hardwareRequirement: 1,
                conclusion: 1,
                references: 1,
                submission: 1,
                feedback: {
                    _id: "$feedback._id",
                    faculty: "$faculty",
                    comment: "$feedback.comment"
                },

            },
        },
    ]);

    // Check if any projects were found
    if (!projectDetails || projectDetails.length === 0) {
        throw new ApiError(404, "No project found for this group");
    }

    // Return success response with project details
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectDetails,
                "Project details fetched successfully"
            )
        );
});


// Update a group Memebers
const updateProjectDetails = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { userId, memberRole } = req.body;

    // Check if group ID is valid
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    // Check if group ID is valid
    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "Invalid group id");
    }

    // Find the group by ID
    const existingGroupMember = await GroupMember.findOne({ group_id: groupId });

    // Check if group exists
    if (!existingGroupMember) {
        throw new ApiError(404, "Group member not found");
    }

    // Update the group
    const updatedGroupMember = await GroupMember.findOneAndUpdate(
        { group_id: groupId, user_id: userId },
        { $set: { member_role: memberRole } },
        { new: true }
    );

    // Return success response
    res
        .status(200)
        .json(
            new ApiResponse(200, updatedGroupMember, "Group updated successfully")
        );
});

// Delete a group
const deleteProjectDetails = asyncHandler(async (req, res) => {
    const { groupMemberId } = req.params;

    // Validation
    if (!isValidObjectId(groupMemberId)) {
        throw new ApiError(400, "Invalid group member id");
    }

    // Find the group by ID
    const existingGroupMember = await GroupMember.findById(groupMemberId); // Renamed variable for clarity

    // Check if group exists
    if (!existingGroupMember) {
        throw new ApiError(404, "Group member not found");
    }

    // Delete the group
    const deleteGroupMember = await GroupMember.findByIdAndDelete(groupMemberId);

    if (!deleteGroupMember) {
        throw new ApiError(
            500,
            "Something went wrong while deleting the group memeber"
        );
    }

    // Return success response
    res
        .status(200)
        .json(new ApiResponse(200, {}, "Group Member deleted successfully"));
});
export {
    registerProjectDetails,
    getProjectDetails,
    updateProjectDetails,
    deleteProjectDetails,
    getAllProjectDetails
};
