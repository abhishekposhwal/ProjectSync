import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Group } from "../models/group.model.js";

// Register a new group
const registerGroup = asyncHandler(async (req, res) => {
    const { groupName } = req.body;

    // Validation
    if (!groupName.trim()) {
        throw new ApiError(400, "Group name cannot be empty");
    }

    // Check if group already exists
    const existingGroup = await Group.findOne({ name: groupName });
    if (existingGroup) {
        throw new ApiError(409, "Group name already exists");
    }

    // Create group
    const newGroup = await Group.create({ name: groupName, createdBy: req.user._id });

    // Return success response
    res
        .status(200)
        .json(new ApiResponse(200, newGroup, "Group created successfully"));
});

// Get all groups
const getAllGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find();

    // Check if groups exist
    if (!groups.length) {
        throw new ApiError(404, "No groups found");
    }

    // Return success response
    res
        .status(200)
        .json(new ApiResponse(200, groups, "Groups fetched successfully"));
});

// Update a group
const updateGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { groupName } = req.body;

    // Validation
    if (!groupName.trim()) {
        throw new ApiError(400, "Group name cannot be empty");
    }

    // Check if group ID is valid
    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "Invalid group id");
    }

    // Find the group by ID
    const existingGroup = await Group.findById(groupId);

    // Check if group exists
    if (!existingGroup) {
        throw new ApiError(404, "Group not found");
    }

    // Check if group name is same as previous one
    if (groupName === existingGroup.name) {
        throw new ApiError(404, "Group name is the same as the previous one");
    }

    // Update the group
    const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { name: groupName },
        { new: true }
    );

    // Return success response
    res
        .status(200)
        .json(new ApiResponse(200, updatedGroup, "Group updated successfully"));
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

export { registerGroup, getAllGroups, updateGroup, deleteGroup };
