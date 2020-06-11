import express from "express";
import { getTeacherSchedules } from "../controllers";
const DashboardRouter: express.Router = express.Router();

DashboardRouter.get("/teacher-schedule", getTeacherSchedules);

export default DashboardRouter;
