import { Router } from "express";
import {
    registerProjectCategory,
    getAllProjectCategories,
    updateProjectCategory,
    deleteProjectCategory
} from "../controllers/projectCategory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/register-project-category").post(verifyJWT, verifyUserRole('admin'), registerProjectCategory)
router.route("/all-project-categories").get(verifyJWT, getAllProjectCategories)
router.route("/update-project-category/:projectCategoryId").patch(verifyJWT, verifyUserRole('admin'), updateProjectCategory);
router.route("/delete-project-category/:projectCategoryId").delete(verifyJWT, verifyUserRole('admin'), deleteProjectCategory);

export default router
