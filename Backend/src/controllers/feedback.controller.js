import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/gorupMember.model.js";
import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { Submission } from "../models/submission.model.js";
import { Feedback } from "../models/feedback.model.js";

// Register new feedback and associate it with a submission
const registerFeedback = asyncHandler(async (req, res) => {

    // Destructure the request body to get the feedback details
    const { comment, submissionId } = req.body;

    // Validate that all required fields are present and not empty
    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment cannot be empty");
    }

    // Validate the submission ID
    if (!mongoose.isValidObjectId(submissionId)) {
        throw new ApiError(400, "Invalid submission ID format");
    }

    // Check if the submission exists
    const existingSubmission = await Submission.findById(submissionId);
    if (!existingSubmission) {
        throw new ApiError(404, `Submission with ID ${submissionId} not found`);
    }

    // Create new feedback
    const newFeedback = await Feedback.create({
        submissionId: submissionId,
        facultyId: req.user._id,
        comment: comment,
    });

    // Fetch the created feedback from the database
    const createdFeedback = await Feedback.findById(newFeedback._id);

    // Check if the feedback was successfully created
    if (!createdFeedback) {
        throw new ApiError(500, "Failed to register feedback, please try again");
    }

    // Return a success response with the created feedback details
    res.status(201).json(
        new ApiResponse(201, createdFeedback, "Feedback registered successfully")
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
                    $arrayElemAt: ["$projectCategoryDetails.name", 0],
                },
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
                feedback: 1,
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

// Update feedback for a submission
const updateFeedback = asyncHandler(async (req, res) => {
    const { submissionId } = req.params;
    const { comment } = req.body;

    // Validate that the comment is not empty
    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment cannot be empty");
    }

    // Validate the submission ID format
    if (!mongoose.isValidObjectId(submissionId)) {
        throw new ApiError(400, "Invalid submission ID format");
    }

    // Check if the submission exists
    const existingFeedback = await Feedback.findOne({ submissionId: submissionId });
    if (!existingFeedback) {
        throw new ApiError(404, `Feedback for submission with ID ${submissionId} not found`);
    }

    // Update the feedback comment
    const updatedFeedback = await Feedback.findOneAndUpdate(
        { submissionId: submissionId },
        { $set: { comment: comment } },
        { new: true }
    );

    // Return success response with the updated feedback
    res
        .status(200)
        .json(
            new ApiResponse(200, updatedFeedback, "Feedback updated successfully")
        );
});

// Delete a group
const deleteProjectDetails = asyncHandler(async (req, res) => {
    const { groupMemberId } = req.params;


    // Destructure the request body to get the feedback details
    const { comment, submissionId } = req.body;

    // Validate that all required fields are present and not empty
    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment cannot be empty");
    }

    // Validate the submission ID
    if (!mongoose.isValidObjectId(submissionId)) {
        throw new ApiError(400, "Invalid submission ID format");
    }

    // Check if the submission exists
    const existingSubmission = await Submission.findById(submissionId);
    if (!existingSubmission) {
        throw new ApiError(404, `Submission with ID ${submissionId} not found`);
    }

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
    registerFeedback,
    getProjectDetails,
    updateFeedback,
    deleteProjectDetails,
};
