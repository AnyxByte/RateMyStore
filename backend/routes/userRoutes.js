import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  fetchUsers,
  updatePassword,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/update", protect, updateUser);
router.get("/all", protect, fetchUsers);
router.post("/change-password", protect, updatePassword);

export default router;
