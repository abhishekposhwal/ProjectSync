import { Router } from "express";
import {
    updateSubmission,
} from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

// router.route("/register-course").post(verifyJWT, verifyUserRole('admin'), registerCourse)
// router.route("/all-courses").get(verifyJWT, getAllCourses)
router.route("/update-submission/:projectId").patch(verifyJWT, verifyUserRole('teacher'), updateSubmission);
// router.route("/delete-course/:courseId").delete(verifyJWT, verifyUserRole('admin'), deleteCourse);

export default router