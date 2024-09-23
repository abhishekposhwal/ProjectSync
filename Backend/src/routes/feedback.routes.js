import { Router } from "express";
import {
    registerFeedback,
    updateFeedback,
} from "../controllers/feedback.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/register-feedback").post(verifyJWT, verifyUserRole(['teacher', 'hod']), registerFeedback)
// router.route("/all-departments").get(verifyJWT, getProjectDetails)
router.route("/update-feedback/:submissionId").patch(verifyJWT, verifyUserRole(['teacher', 'hod']), updateFeedback);
// router.route("/delete-department/:departmentId").delete(verifyJWT, verifyUserRole('admin'), deleteProjectDetails);

export default router
