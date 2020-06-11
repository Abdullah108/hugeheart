import express from "express";
import {
  assignTeacher,
  getAssignedTeachers,
  removeTeacherFromMA
} from "../controllers";

const TMAAssignmentRouter: express.Router = express.Router();

// TMAAssignmentRouter.get("/", getTeachers);
TMAAssignmentRouter.post("/", assignTeacher);
TMAAssignmentRouter.patch("/", removeTeacherFromMA);
TMAAssignmentRouter.get("/:id", getAssignedTeachers);

export default TMAAssignmentRouter;
