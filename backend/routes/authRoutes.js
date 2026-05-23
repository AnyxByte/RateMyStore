import express from "express";
import {
  signupUser,
  loginUser,
  verifyUserRole,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

router.post("/verify-role", protect, verifyUserRole);

export default router;
