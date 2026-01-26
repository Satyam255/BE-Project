import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getMySavedJobs, saveJob, unsaveJob } from "../controllers/savedJob.controller.js";

const router = express.Router();

router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);
router.get("/my", protect, getMySavedJobs);

export default router;
