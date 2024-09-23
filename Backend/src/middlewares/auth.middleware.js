import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    const UserDetails = await User.aggregate([
      {
        $match: {
          _id: user._id
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


    req.user = UserDetails[0];
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});