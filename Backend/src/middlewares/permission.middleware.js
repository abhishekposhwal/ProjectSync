import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserRole } from "../models/userRole.model.js";
export const verifyUserRole = (requiredRoles) => asyncHandler(async (req, res, next) => {
    try {
        const userRoleId = req.user.user_role;

        if (!userRoleId) {
            throw new ApiError(401, "Unauthorized access: User role is empty");
        }

        const userRole = await UserRole.findById(userRoleId);
        console.log("UserRole", userRole);

        // Check if the user's role matches any of the required roles
        if (!userRole || !requiredRoles.includes(userRole.role)) {
            throw new ApiError(401, "Unauthorized access: User role does not match required role(s)");
        }

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized access");
    }
});
