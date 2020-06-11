import express from "express";
import {
  getAssignedMaterials,
  requestMaterial,
  getFoldersMaterials
} from "../../controllers/master-admin";
import multer from "multer";
import { materialStorageFile } from "../../common";

const TMaterialAssignmentRouter: express.Router = express.Router();

const upload: multer.Instance = multer({ storage: materialStorageFile });

TMaterialAssignmentRouter.post("/", upload.single("file"), requestMaterial);
TMaterialAssignmentRouter.get("/", getAssignedMaterials);
TMaterialAssignmentRouter.get("/:folderId", getFoldersMaterials);
/**
 *
 */
export default TMaterialAssignmentRouter;
