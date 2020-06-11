import express from "express";
import {
  addFolder,
  getFolders,
  udpateFolder,
  uploadFolder,
  deleteFolder,
  uploadCurriculumFolder
} from "../controllers";
import multer from "multer";
import { materialStorageFile, curriculumStorageFile } from "../common";

const upload: multer.Instance = multer({ storage: materialStorageFile });
const uploadCurriculum: multer.Instance = multer({
  storage: curriculumStorageFile
});

const FolderRouter: express.Router = express.Router();

FolderRouter.get("/", getFolders);
FolderRouter.post("/", addFolder);
FolderRouter.put("/:id", udpateFolder);
FolderRouter.delete("/", deleteFolder);
FolderRouter.post("/upload-zip", upload.single("file"), uploadFolder);
FolderRouter.post(
  "/upload-curriculum-zip",
  uploadCurriculum.single("file"),
  uploadCurriculumFolder
);
/*  */
export default FolderRouter;
