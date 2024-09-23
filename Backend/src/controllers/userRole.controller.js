import { asyncHandler } from "../utils/asyncHandler.js"; //  asyncHandler utility for handling asynchronous operations
import { ApiError } from "../utils/apiError.js";
import { UserRole } from "../models/userRole.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

const registerUserRole = asyncHandler(async (req, res) => {
    // get userRole details from frontend
    // validation - not empty
    // craete user object - create entry in db
    // check for user creation
    // return response

    // Get user role details from the request body
    const { role } = req.body

    // Validate that all required fields are present and not empty
    if (![role].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user with the provided username or email already exists
    const existedUserROle = await UserRole.findOne({
        $or: [{ role }]
    })

    if (existedUserROle) {
        throw new ApiError(409, "User Role already exists")
    }

    // Create a new user role in the database
    const user_role = await UserRole.create({
        role,
    })

    // Fetch the created user role from the database
    const createdUserRole = await UserRole.findById(user_role._id).select()

    if (!createdUserRole) {
        throw new ApiError(500, "Something went wrong while inserting the user role into the database")
    }

    // Return success response with the registered user role details
    return res.status(200).json(
        new ApiResponse(200, createdUserRole, "User role inserted Successfully")
    )
})


const getUserRoles = asyncHandler(async (req, res) => {
    try {
        const userRoles = await UserRole.find();
        if (!userRoles || userRoles.length === 0) {
            throw new ApiError(404, "No user roles found");
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                userRoles,
                "User roles fetched successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to fetch user roles");
    }
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { roleId } = req.params
    const { role } = req.body;

    if (!roleId) {
        throw new ApiError(400, " Invalid roleId")
    }

    if (![role].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    const userRole = await UserRole.findByIdAndUpdate(
        roleId,
        { $set: { role: role } },
        { new: true }

    );

    if (!userRole) {
        throw new ApiError(500, "Failed to update user role. please try again!!");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            userRole,
            "User details updated successfully"
        ))
})

const deleteUserRole = asyncHandler(async (req, res) => {
    const { roleId } = req.params

    console.log("Role id", roleId);

    if (!isValidObjectId(roleId)) {
        throw new ApiError(400, "Invalid role id");
    }

    const userRole = await UserRole.findById(roleId);

    if (!userRole) {
        throw new ApiError(404, "No user role found");
    }

    if (userRole?.role.toString() === "admin") {
        throw new ApiError(
            400,
            "You can't delete admin role"
        );
    }

    const userRoleDeleted = await UserRole.findByIdAndDelete(userRole?._id);

    if (!userRoleDeleted) {
        throw new ApiError(400, "Failed to delete the user role. please try again!!");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "User role deleted successfully"
        ))
})



export {
    registerUserRole,
    getUserRoles,
    updateUserRole,
    deleteUserRole
}