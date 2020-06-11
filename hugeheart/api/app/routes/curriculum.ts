import express from "express";
import {
  getCurriculum,
  deleteCurriculum,
  addCurriculum
} from "./../controllers";
import { curriculumStorageFile } from "../common";
import multer from "multer";

const CurriculumRouter: express.Router = express.Router();
const upload: multer.Instance = multer({ storage: curriculumStorageFile });

CurriculumRouter.get("/", getCurriculum);
CurriculumRouter.delete("/", deleteCurriculum);
CurriculumRouter.post("/", upload.single("file"), addCurriculum);

export default CurriculumRouter;
