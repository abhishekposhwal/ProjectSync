import { Router } from "express";
import {
    registerGroup,
    getAllGroups,
    updateGroup,
    deleteGroup
} from "../controllers/group.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/register-group").post(verifyJWT, verifyUserRole(['admin', 'student']), registerGroup)
router.route("/all-groups").get(verifyJWT, getAllGroups)
router.route("/update-group/:groupId").patch(verifyJWT, verifyUserRole(['admin', 'student']), updateGroup);
router.route("/delete-group/:groupId").delete(verifyJWT, verifyUserRole(['admin', 'student']), deleteGroup);

export default router
