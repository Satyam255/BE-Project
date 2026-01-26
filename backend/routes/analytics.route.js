import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getEmployerAnalytics } from "../controllers/analytics.controller.js";


const router = express.Router();

router.get("/overview", protect, getEmployerAnalytics);

export default router;