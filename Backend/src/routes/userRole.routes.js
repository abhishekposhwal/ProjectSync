import { Router } from "express";
import {} from "../controllers/user.controller.js";
import { registerUserRole, getUserRoles, updateUserRole, deleteUserRole} from "../controllers/userRole.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/user-role").post(verifyJWT, registerUserRole)
router.route("/fetched-user-roles").get(verifyJWT, verifyUserRole('admin'), getUserRoles)
router.route("/update-user-role/:roleId").patch(verifyJWT, verifyUserRole('admin'), updateUserRole);
router.route("/delete-user-role/:roleId").delete(verifyJWT, verifyUserRole('admin'), deleteUserRole);
export default router