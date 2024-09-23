import { Router } from "express";
import {
    registerDepartment,
    getAllDepartments,
    updateDepartment,
    deleteDepartment
} from "../controllers/department.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/register-department").post(verifyJWT, verifyUserRole('admin'), registerDepartment)
router.route("/all-departments").get(verifyJWT, getAllDepartments)
router.route("/update-department/:departmentId").patch(verifyJWT, verifyUserRole('admin'), updateDepartment);
router.route("/delete-department/:departmentId").delete(verifyJWT, verifyUserRole('admin'), deleteDepartment);

export default router
