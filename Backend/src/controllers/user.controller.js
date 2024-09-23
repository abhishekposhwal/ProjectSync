// Import necessary modules and utilities
import { asyncHandler } from "../utils/asyncHandler.js"; //  asyncHandler utility for handling asynchronous operations
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserRole } from "../models/userRole.model.js";


// Function to generate access and refresh tokens for a user
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Generate access and refresh tokens for the user
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Update the user's refresh token in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Return the generated tokens
        return { accessToken, refreshToken }

    } catch (error) {
        // If an error occurs, throw an ApiError with a 500 status code
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}

// Handler for user registration
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists - username, email
    // check for images, check for avatar
    // upload them to cloudinary, check successfully uploaded avatr
    // craete user object - create entry in db
    // reomve password and refresh token fields from response
    // check for user creation
    // return response

    // Get user details from the request body
    const { fullName, email, userName, password, gender, mobile_no, user_role } = req.body
    console.log('fullName', fullName)

    // Validate that all required fields are present and not empty
    if (![fullName, email, userName, password, gender, mobile_no].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required !!");
    }

    // Check if user with the provided username or email already exists
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "UserName or Email already exists")
    }

    // Create a new user in the database
    const user = await User.create({
        fullName,
        email,
        password,
        gender,
        mobile_no,
        user_role,
        userName: userName.toLowerCase(),
    })

    // Fetch the created user from the database excluding sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const createdUserDetails = await User.aggregate([
        {
            $match: {
                _id: createdUser._id
            }
        },
        {
            $lookup: {
                from: "userroles",
                localField: "user_role",
                foreignField: "_id",
                as: "userRoleDetails",
            },
        },
        {
            $addFields: {
                userRole: {
                    $arrayElemAt: ["$userRoleDetails.role", 0]
                }
            },
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                email: 1,
                gender: 1,
                mobile_no: 1,
                user_role: 1,
                userRole: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
    ]);


    // Return success response with the registered user details
    return res.status(200).json(
        new ApiResponse(200, createdUserDetails[0], "User registered Successfully")
    )
})




const loginUser = asyncHandler(async (req, res) => {
    // req body --> data
    // userName or email
    // find the user
    // password check
    // access and refresh token
    // send cookie
    console.log(req.body);

    // const {userName, password} = req.body
    const { email, userName, password } = req.body

    console.log(req.body);
    if (!(userName || email)) {
        throw new ApiError(400, "Username or password is required");
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const loggedInUserDetails = await User.aggregate([
        {
            $match: {
                _id: loggedInUser._id
            }
        },
        {
            $lookup: {
                from: "userroles",
                localField: "user_role",
                foreignField: "_id",
                as: "userRoleDetails",
            },
        },
        {
            $addFields: {
                userRole: {
                    $arrayElemAt: ["$userRoleDetails.role", 0]
                }
            },
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                email: 1,
                gender: 1,
                mobile_no: 1,
                user_role: 1,
                userRole: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
    ]);

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUserDetails[0],
                    accessToken,
                    refreshToken
                },
                "User Logged In Successfully"
            )
        )
})

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }


    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Log Out Successfully"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = Jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Chnaged Successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "Current User Fetched Successfully"
        ))
})

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            throw new ApiError(404, "No user found");
        }

        const userDetails = await User.aggregate([
            {
                $lookup: {
                    from: "userroles",
                    localField: "user_role",
                    foreignField: "_id",
                    as: "userRoleDetails",
                },
            },
            {
                $addFields: {
                    userRole: {
                        $arrayElemAt: ["$userRoleDetails.role", 0]
                    }
                },
            },
            {
                $project: {
                    fullName: 1,
                    userName: 1,
                    email: 1,
                    gender: 1,
                    mobile_no: 1,
                    user_role: 1,
                    userRole: 1,
                    userRole: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                userDetails,
                "Users fetched successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to fetch all users");
    }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "Account details updated successfully"
        ))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new Error(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new Error(400, "Error while uploading on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar is updated successfully"
            )
        )

})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new Error(400, "Cover image file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new Error(400, "Error while uploading on cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Cover image is updated successfully"
            )
        )

})


const getUserCahnnelProfile = asyncHandler(async () => {
    const { username } = req.params

    if (!username) {
        throw new Error(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                userName: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "suscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            },
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
            }
        }
    ])

    console.log(" channel ", channel);

    if (!channel?.length) {
        throw new Error(400, "channel does not exists");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                "Channel fetched successfully"
            )
        )
})

const getWatchHistory = asyncHandler(async () => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{
                                $project: {
                                    fullName: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $frist: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        )
})

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserCahnnelProfile,
    getWatchHistory,
    getAllUsers
}