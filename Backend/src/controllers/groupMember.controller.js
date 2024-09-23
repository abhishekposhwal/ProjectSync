import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/gorupMember.model.js";
import mongoose from "mongoose";

// Register a new group member
const registerGroupMember = asyncHandler(async (req, res) => {

    const { groupId, userId, memberRole } = req.body;

    // Check if user role ID is valid
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }
    console.log(userId);
    // Check if User already exists or not.
    const existedUser = await GroupMember.findOne({
        $or: [{ user_id: userId }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    // Check if group ID is valid
    if (!isValidObjectId(groupId)) {
        throw new ApiError(400, "Invalid group id");
    }

    // Check if group ID is valid
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    // Validation
    if (!memberRole.trim()) {
        throw new ApiError(400, "Member role cannot be empty");
    }

    // Create group member
    const newGroupMember = await GroupMember.create({
        group_id: groupId,
        user_id: userId,
        member_role: memberRole,
    });

    // Return success response
    res
        .status(201)
        .json(
            new ApiResponse(201, newGroupMember, "Group member add successfully")
        );
});

// Get all group members
const getAllGroupMembers = asyncHandler(async (req, res) => {
    // Aggregate to get all groups with filtered member count
    const groupDetails = await Group.aggregate([
        {
            $lookup: {
                from: "groupmembers",
                localField: "_id",
                foreignField: "group_id",
                as: "members"
            }
        },
        {
            $addFields: {
                membersWithRole: {
                    $filter: {
                        input: "$members",
                        as: "member",
                        cond: { $ne: ["$$member.member_role", "Mentor"] } // Exclude members with role "Mentor"
                    }
                },
                memberCount: { $size: "$members" } // Calculate the count of all members
            }
        },
        {
            $addFields: {
                memberCountFiltered: { $size: "$membersWithRole" } // Calculate the count of members after filtering
            }
        },
        {
            $project: {
                members: 0, // Exclude the original members array from the result
                membersWithRole: 0 // Exclude the filtered members array from the result
            }
        }
    ]);

    // Check if any groups were found
    if (!groupDetails || groupDetails.length === 0) {
        throw new ApiError(404, "No groups found");
    }

    // Return success response with group details
    res.status(200).json({
        status: "success",
        data: groupDetails
    });
});

// get all group member for a group


const getGroupMembers = asyncHandler(async (req, res) => {
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
                group_id: new mongoose.Types.ObjectId(groupId)
            }
        },
        {
            $lookup: {
                from: "groups",
                localField: "group_id",
                foreignField: "_id",
                as: "groupDetails",
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

                groupName: {
                    $arrayElemAt: ["$groupDetails.name", 0],
                },
                createdBy: {
                    $arrayElemAt: ["$groupDetails.createdBy", 0],
                },
            },
        },
        {
            $project: {
                group_id: 1,
                groupName: 1,
                createdBy: 1,
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

    return res.status(200).json(new ApiResponse(200, groupMemberAggregate, "Group members fetched successfully"));
});

const getAllGroupMember = asyncHandler(async (req, res) => {

    const groupMemberAggregate = await GroupMember.aggregate([

        {
            $lookup: {
                from: "groups",
                localField: "group_id",
                foreignField: "_id",
                as: "groupDetails",
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

                groupName: {
                    $arrayElemAt: ["$groupDetails.name", 0],
                },
                createdBy: {
                    $arrayElemAt: ["$groupDetails.createdBy", 0],
                },
            },
        },
        {
            $project: {
                group_id: 1,
                groupName: 1,
                createdBy: 1,
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

    return res.status(200).json(new ApiResponse(200, groupMemberAggregate, "Group members fetched successfully"));
});

// Update a group Memebers
const updateGroupMember = asyncHandler(async (req, res) => {
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
        .json(new ApiResponse(200, updatedGroupMember, "Group updated successfully"));
});

// Delete a group
const deleteGroupMember = asyncHandler(async (req, res) => {
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
        throw new ApiError(500, "Something went wrong while deleting the group memeber")
    }

    // Return success response
    res.status(200).json(new ApiResponse(200, {}, "Group Member deleted successfully"));
});
export { registerGroupMember, getGroupMembers, updateGroupMember, deleteGroupMember, getAllGroupMembers, getAllGroupMember };
