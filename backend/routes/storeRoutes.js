import express from "express";
import {
  addRatingToStore,
  fetchUserStoreFeed,
  fetchOwnerDashboard,
} from "../controllers/storeController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/feed", authorizeRoles("User"), fetchUserStoreFeed);
router.post("/rate", authorizeRoles("User"), addRatingToStore);

router.get(
  "/owner-dashboard",
  authorizeRoles("StoreOwner"),
  fetchOwnerDashboard,
);

export default router;
