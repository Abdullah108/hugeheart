import express from "express";
import {
  addPrinciple,
  getPrinciple,
  getPrincipleDetails,
  updatePrinciple,
  deletePrinciple
} from "./../controllers";

import multer from "multer";
import { principleStorageFile } from "../common";

const PRINCIPLEROUTER: express.Router = express.Router();

// Upload image File using multer
const upload: multer.Instance = multer({ storage: principleStorageFile });

PRINCIPLEROUTER.get("/", getPrinciple);
PRINCIPLEROUTER.post("/", upload.single("document"), addPrinciple);
PRINCIPLEROUTER.post("/:id", upload.single("document"), updatePrinciple);
PRINCIPLEROUTER.delete("/", deletePrinciple);
PRINCIPLEROUTER.get("/:id", getPrincipleDetails);

export default PRINCIPLEROUTER;
