import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Group } from "../models/group.model.js";
import { Submission } from "../models/submission.model.js";


// Update a submission
const updateSubmission = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { status, mentorApproval } = req.body;

    // Validate the project ID
    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }

    console.log(status, mentorApproval, projectId);
    // Find the submission by project ID
    const existingSubmission = await Submission.findOne({ projectId });

    // Check if the submission exists
    if (!existingSubmission) {
        throw new ApiError(404, "Submission id not found");
    }

    // Update the submission with the provided status and mentor approval
    const updatedSubmission = await Submission.findOneAndUpdate(
        { projectId },
        { status: status, mentorApproval: mentorApproval },
        { new: true }
    );

    // Return success response
    res
        .status(200)
        .json(new ApiResponse(200, updatedSubmission, "Submission updated successfully"));
});


// Delete a group
const deleteGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    // Validation
    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "Invalid group id");
    }

    // Find the group by ID
    const existingGroup = await Group.findById(groupId); // Renamed variable for clarity

    // Check if group exists
    if (!existingGroup) {
        throw new ApiError(404, "Group not found");
    }

    // Delete the group
    await Group.findByIdAndDelete(groupId);

    // Return success response
    res.status(200).json(new ApiResponse(200, {}, "Group deleted successfully"));
});

export { updateSubmission, deleteGroup };
