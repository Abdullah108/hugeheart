import express from "express";
import { getAllTeachers, viewTeacher } from "../../controllers/master-admin";
import { ValidateMasterAdminToken } from "../../common";
import { getDashboardTeacherSchedule, leaveStatus } from "../../controllers";
import { getTeacherSchedule } from "../../controllers";

const TeacherMARouter: express.Router = express.Router();

TeacherMARouter.get("/", ValidateMasterAdminToken, getAllTeachers);
TeacherMARouter.get("/teacher-schedule", getDashboardTeacherSchedule)
TeacherMARouter.get("/get-teacher-schedule", getTeacherSchedule);
TeacherMARouter.get("/:id", viewTeacher);
TeacherMARouter.put("/:id", leaveStatus)

export default TeacherMARouter;
