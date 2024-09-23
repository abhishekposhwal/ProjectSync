import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserCahnnelProfile,
    getWatchHistory,
    logOutUser,
    loginUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    getAllUsers
} from "../controllers/user.controller.js";
import { registerUserRole } from "../controllers/userRole.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/all-users").get(verifyJWT, getAllUsers)

router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserAvatar)
router.route("/c/:username").get(verifyJWT, getUserCahnnelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

// admin routes
router.route("/user-role").post(verifyJWT, registerUserRole)

export default router