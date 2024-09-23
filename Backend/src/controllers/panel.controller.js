import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Group } from "../models/group.model.js";
import { Panel } from "../models/panel.model.js";
import { PanelMember } from "../models/panelMember.model.js";

// Register a new group
const registerPanel = asyncHandler(async (req, res) => {
    const { panelName, presentationNumber } = req.body;

    // Validate that all required fields are present and not empty
    if (
        ![panelName, presentationNumber].every(
            (field) => field && field.trim() !== ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if group already exists
    const existingPanel = await Panel.findOne({ name: panelName });
    if (existingPanel) {
        throw new ApiError(409, "Panel name already exists");
    }

    // Create group
    const newPanel = await Panel.create({
        name: panelName,
        presentation: presentationNumber,
    });

    // Fetch the created user from the database excluding sensitive fields
    const createdPanel = await Panel.findById(newPanel._id);

    if (!createdPanel) {
        throw new ApiError(500, "Something went wrong while registering the panel");
    }

    // Return success response
    res
        .status(201)
        .json(new ApiResponse(201, createdPanel, "Panel created successfully"));
});

// Get all groups
const getAllPanels = asyncHandler(async (req, res) => {
    const panels = await Panel.find();

    // Check if groups exist
    if (!panels.length) {
        throw new ApiError(404, "No panel found");
    }

    // Return success response
    res
        .status(200)
        .json(new ApiResponse(200, panels, "Panels fetched successfully"));
});

// Update a group
const updatePanel = asyncHandler(async (req, res) => {
    const { panelId } = req.params;
    const { panelName, presentationNumber } = req.body;

    // Check if group ID is valid
    if (!isValidObjectId(panelId)) {
        throw new ApiError(400, "Invalid panel id");
    }

    // Find the group by ID
    const existingPanel = await Panel.findById(panelId);

    // Check if group exists
    if (!existingPanel) {
        throw new ApiError(404, "Panel not found");
    }

    // Update the group
    const updatedPanel = await Panel.findByIdAndUpdate(
        panelId,
        { name: panelName, presentation: presentationNumber },
        { new: true }
    );

    if (!updatedPanel) {
        throw new ApiError(500, "Something went wrong while updating the panel");
    }

    // Return success response
    res
        .status(200)
        .json(new ApiResponse(200, updatedPanel, "Panel updated successfully"));
});

// Delete a group
const deletePanel = asyncHandler(async (req, res) => {
    const { panelId } = req.params;

    // Validation
    if (!isValidObjectId(panelId)) {
        throw new ApiError(400, "Invalid panel id");
    }

    // Find the group by ID
    const existingPanel = await Panel.findById(panelId); // Renamed variable for clarity

    // Check if group exists
    if (!existingPanel) {
        throw new ApiError(404, "Panel not found");
    }

    // Delete the group
    const panelDeleted = await Panel.findByIdAndDelete(existingPanel._id);

    if (!panelDeleted) {
        throw new ApiError(400, "Failed to delete the panel. please try again!!");
    }

    // Return success response
    res.status(200).json(new ApiResponse(200, {}, "Panel deleted successfully"));
});














// Register a new panel member
const registerPanelMember = asyncHandler(async (req, res) => {
    const { panelId, userId } = req.body;

    // Validation
    if (!isValidObjectId(panelId)) {
        throw new ApiError(400, "Invalid panel id");
    }

    // Find the group by ID
    const existingPanel = await Panel.findById(panelId); // Renamed variable for clarity

    // Check if group exists
    if (!existingPanel) {
        throw new ApiError(404, "Panel not found");
    }

    // Check if user role ID is valid
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }
    console.log(userId);
    // Check if User already exists or not.

    const existedUser = await PanelMember.findOne({
        $or: [{ userId: userId }],
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    // Create group member
    const newPanelMember = await PanelMember.create({
        panelId: panelId,
        userId: userId,
    });

    // Return success response
    res
        .status(200)
        .json(
            new ApiResponse(200, newPanelMember, "Panel member add successfully")
        );
});

// Get all groups
// const getAllGroups = asyncHandler(async (req, res) => {
//     const groups = await Group.find();

//     // Check if groups exist
//     if (!groups.length) {
//         throw new ApiError(404, "No groups found");
//     }

//     // Return success response
//     res
//         .status(200)
//         .json(new ApiResponse(200, groups, "Groups fetched successfully"));
// });

// get all group member for a group
const getPanelMembers = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    // Check if group ID is valid
    if (!mongoose.isValidObjectId(groupId)) {
        throw new ApiError(400, "Invalid group id");
    }

    const group = await Group.findById(groupId);

    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    const groupMemberAggregate = await GroupMember.aggregate([
        {
            $match: {
                group_id: new mongoose.Types.ObjectId(groupId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        {
            $lookup: {
                from: "userprofiles",
                localField: "userDetails._id",
                foreignField: "userId",
                as: "profileDetails",
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "profileDetails.department",
                foreignField: "_id",
                as: "departmentDetails",
            },
        },
        {
            $lookup: {
                from: "courses",
                localField: "profileDetails.course",
                foreignField: "_id",
                as: "courseDetails",
            },
        },
        {
            $lookup: {
                from: "projectcategories",
                localField: "profileDetails.areasOfExpertise",
                foreignField: "_id",
                as: "areasOfExpertiseDetails",
            },
        },
        {
            $addFields: {
                userDetails: {
                    $arrayElemAt: ["$userDetails", 0],
                },
                profile: {
                    $arrayElemAt: ["$profileDetails", 0],
                },
                department: {
                    $arrayElemAt: ["$departmentDetails", 0],
                },
                course: {
                    $arrayElemAt: ["$courseDetails", 0],
                },
                areasOfExpertise: "$areasOfExpertiseDetails.name",
            },
        },
        {
            $project: {
                group_id: 1,
                userInfo: {
                    name: "$userDetails.fullName",
                    email: "$userDetails.email",
                    gender: "$userDetails.gender",
                    mobileNumber: "$userDetails.mobile_no",
                    rollNumber: "$profile.rollNumber",
                    section: "$profile.section",
                    roleDuringProject: "$profile.roleDuringProject",
                    department: "$department.name",
                    course: "$course.name",
                    academicYear: "$profile.academicYear",
                    experience: "$profile.experience",
                    areasOfExpertise: "$areasOfExpertise",
                },
                user_id: 1,
                member_role: 1,
            },
        },
    ]);

    if (!groupMemberAggregate || groupMemberAggregate.length === 0) {
        throw new ApiError(404, "No members found for this group");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                groupMemberAggregate,
                "Group members fetched successfully"
            )
        );
});

// Update a group Memebers
const updatePanelMember = asyncHandler(async (req, res) => {
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
const deletePanelMember = asyncHandler(async (req, res) => {
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
    registerPanel,
    getAllPanels,
    updatePanel,
    deletePanel,
    registerPanelMember,
    getPanelMembers,
    updatePanelMember,
    deletePanelMember,
};
