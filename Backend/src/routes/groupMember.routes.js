import { Router } from "express";
import {
    registerGroupMember,
    getGroupMembers,
    updateGroupMember,
    deleteGroupMember,
    getAllGroupMembers,
    getAllGroupMember
} from "../controllers/groupMember.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/register-group-member").post(verifyJWT, verifyUserRole(['admin', 'student']), registerGroupMember)
router.route("/group-members/:groupId").get(verifyJWT, getGroupMembers)
router.route("/all-group-members").get(verifyJWT, getAllGroupMembers)
router.route("/get-group-members").get(verifyJWT, getAllGroupMember)
router.route("/update-group-member/:groupId").patch(verifyJWT, verifyUserRole(['admin', 'student']), updateGroupMember);
router.route("/delete-group-member/:groupMemberId").delete(verifyJWT, verifyUserRole(['admin', 'student']), deleteGroupMember);

export default router
