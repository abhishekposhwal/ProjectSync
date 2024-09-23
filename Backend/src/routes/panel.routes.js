import { Router } from "express";
import {
    registerPanel,
    getAllPanels,
    updatePanel,
    deletePanel,
    registerPanelMember,
    getPanelMembers,
    updatePanelMember,
    deletePanelMember,
} from "../controllers/panel.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyUserRole } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/register-panel").post(verifyJWT, verifyUserRole(['admin']), registerPanel)
router.route("/all-panels").get(verifyJWT, getAllPanels)
router.route("/update-panel/:panelId").patch(verifyJWT, verifyUserRole(['admin']), updatePanel);
router.route("/delete-panel/:panelId").delete(verifyJWT, verifyUserRole(['admin']), deletePanel);

router.route("/register-panel-member").post(verifyJWT, verifyUserRole(['admin']), registerPanelMember)
router.route("/all-panel-members/:panelId").get(verifyJWT, getPanelMembers)
router.route("/update-panel-memeber/:panelId").patch(verifyJWT, verifyUserRole(['admin']), updatePanelMember);
router.route("/delete-panel-member/:panelId").delete(verifyJWT, verifyUserRole(['admin']), deletePanelMember);
export default router
