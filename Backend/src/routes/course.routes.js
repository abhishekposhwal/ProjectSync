import { Router } from "express";
import {
    registerCourse, 
    getAllCourses,
    updateCourse,
    deleteCourse
} from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/register-course").post(verifyJWT, verifyUserRole('admin'), registerCourse)
router.route("/all-courses").get(verifyJWT, getAllCourses)
router.route("/update-course/:courseId").patch(verifyJWT, verifyUserRole('admin'), updateCourse);
router.route("/delete-course/:courseId").delete(verifyJWT, verifyUserRole('admin'), deleteCourse);

export default router