import { protect } from "../middlewares/auth.middleware.js";
import express from "express";
import { createJob, deleteJob, getJobById, getJobs, getJobsEmployer, toggleCloseJob, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/").post(protect, createJob).get(getJobs);
router.route("/get-jobs-employer").get(protect, getJobsEmployer);
router.route("/:id").get(getJobById).put(protect, updateJob).delete(protect, deleteJob); 
router.put("/:id/toggle-close", protect, toggleCloseJob);

export default router;