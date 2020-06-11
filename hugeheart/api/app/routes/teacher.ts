import express from "express";
import {
  getTeachers,
  addNewTeacher,
  deleteTeacher,
  activateOrDeactiveTeacher,
  getTeacherDetails,
  updateTeacher,
  getTeacherSchedule,
  getDashboardTeacherSchedule,
  leaveRequest
} from "./../controllers";
import multer from "multer";
import { storageFile } from "../common";
const TeacherRouter: express.Router = express.Router();
const upload: multer.Instance = multer({ storage: storageFile });

TeacherRouter.get("/", getTeachers);
TeacherRouter.post("/", upload. fields( [{ name: 'profileImage', maxCount: 1 }, { name: 'resume', maxCount: 1 } ]
), addNewTeacher); /* upload.single("profileImage, resume") */

TeacherRouter.get("/get-teacher-schedule", getTeacherSchedule);
TeacherRouter.post("/:id", upload. fields( [{ name: 'profileImage', maxCount: 1 }, { name: 'resume', maxCount: 1 } ]
), updateTeacher);
TeacherRouter.delete("/", deleteTeacher);
TeacherRouter.patch("/", activateOrDeactiveTeacher);
TeacherRouter.get("/:id", getTeacherDetails);

export default TeacherRouter;
