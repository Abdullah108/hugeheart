import express from "express";
import {
  getAllMasterAdmin,
  addNewMasterAdmin,
  deletMasterAdmin,
  activateOrDeactiveMasterAdmin,
  getMasterAdminDetails,
  updateMasterAdmin
} from "./../controllers";
import { AddMasterAdminValidations } from "../validations";

const MasterAdminRouter: express.Router = express.Router();

MasterAdminRouter.get("/", getAllMasterAdmin);
MasterAdminRouter.post("/", AddMasterAdminValidations, addNewMasterAdmin);
MasterAdminRouter.put("/:id", AddMasterAdminValidations, updateMasterAdmin);
MasterAdminRouter.delete("/", deletMasterAdmin);
MasterAdminRouter.patch("/", activateOrDeactiveMasterAdmin);
MasterAdminRouter.get("/:id", getMasterAdminDetails);

export default MasterAdminRouter;
