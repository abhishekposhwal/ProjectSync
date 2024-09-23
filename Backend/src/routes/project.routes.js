import { Router } from "express";
import {
    registerProjectDetails,
    getProjectDetails,
    updateProjectDetails,
    deleteProjectDetails,
    getAllProjectDetails
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/register-project-details").post(verifyJWT, verifyUserRole(['student']), registerProjectDetails)
router.route("/register-project-details").post(verifyJWT, verifyUserRole(['student']), registerProjectDetails)
router.route("/project/:groupId").get(verifyJWT, verifyUserRole(['student', 'admin', 'teacher']), getProjectDetails)
router.route("/all-projects").get(verifyJWT, verifyUserRole(['student', 'admin', 'teacher']), getAllProjectDetails)
router.route("/update-group-member/:groupId").patch(verifyJWT, verifyUserRole(['admin', 'student']), updateProjectDetails);
router.route("/delete-group-member/:groupMemberId").delete(verifyJWT, verifyUserRole(['admin', 'student']), deleteProjectDetails);

export default router
