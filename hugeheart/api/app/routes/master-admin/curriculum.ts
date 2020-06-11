import express from "express";
import { getCurriculum } from "./../../controllers";

const CurriculumRouter: express.Router = express.Router();

CurriculumRouter.get("/", getCurriculum);

export default CurriculumRouter;
