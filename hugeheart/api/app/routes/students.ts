import express from "express";
import {
  getStudents,
  addStudent,
  getStudentDetails,
  updateStudent,
  assignTeacherToStudent,
  enrollStudent,
  leaveFeedback,
  getStudentSchedule,
  leaveRequest,
  deleteStudent,
} from "./../controllers";

const StudentRouter: express.Router = express.Router();

StudentRouter.get("/", getStudents);
StudentRouter.post("/", addStudent);
StudentRouter.put("/delete-student", deleteStudent);
StudentRouter.post("/leave-feedback", leaveFeedback);
StudentRouter.post("/leave-request/:id", leaveRequest);
StudentRouter.post("/assign-teacher", assignTeacherToStudent);
StudentRouter.get("/schedule", getStudentSchedule);
StudentRouter.put("/enroll/:id", enrollStudent);
StudentRouter.put("/:id", updateStudent);
StudentRouter.get("/:id", getStudentDetails);

export default StudentRouter;
