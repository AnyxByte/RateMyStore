import express from "express";
import {
  addNewStore,
  adminCreateUser,
  fetchAdminExtendedDashboard,
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("Admin"));

router.get("/dashboard-extended", fetchAdminExtendedDashboard);
router.post("/users/create", adminCreateUser);
router.post("/stores/create", addNewStore);
export default router;
