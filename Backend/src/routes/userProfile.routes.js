import { Router } from "express";
import {
    registerUserProfile,
    getUserProfile,
    updateUserProfile,
} from "../controllers/userProfile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router
    .route("/register-user-profile")
    .post(verifyJWT, verifyUserRole(['admin', 'student', 'teacher']), registerUserProfile);
router.route("/user-profile/").get(verifyJWT, getUserProfile);
router
    .route("/update-user-profile/:userProfileId")
    .patch(verifyJWT, verifyUserRole(['admin', 'student', 'teacher']), updateUserProfile);
// router
//     .route("/delete-user-profile/:userProfileId")
//     .delete(verifyJWT, verifyUserRole("admin"), deleteUserProfile);

export default router;
