import express from "express";
import { addMaterial, getMaterial, deleteMaterial, getMaterialDetails, updateMaterial } from "./../controllers";
import multer from "multer";
import { materialStorageFile } from "../common";
const MaterialRouter: express.Router = express.Router();
const upload: multer.Instance = multer({ storage: materialStorageFile });

MaterialRouter.get("/", getMaterial);
MaterialRouter.get("/:id", getMaterialDetails);

MaterialRouter.post("/", upload.single("file"), addMaterial);
MaterialRouter.delete("/", deleteMaterial);
MaterialRouter.post("/:id", upload.single("file"), updateMaterial);



export default MaterialRouter;
