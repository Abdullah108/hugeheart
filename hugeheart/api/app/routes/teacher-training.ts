import express from "express";
import { addNewTraining } from "../controllers";
const TeacherTrainingRouter: express.Router = express.Router();

TeacherTrainingRouter.post("/", addNewTraining);

export default TeacherTrainingRouter;
