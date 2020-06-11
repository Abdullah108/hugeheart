import express from "express";
import {
  addBrand,
  getAllBrand,
  viewBrand,
  updateBrand,
  deleteBrand,
  activateOrDeactiveBrand,
  assignTasktoBrand,
  viewAssignTask,
  maerkAssignTask,
  getAssignedTaskForBA
} from "../../controllers/master-admin";
import { AddMasterAdminValidations } from "../../validations";
import { ValidateMasterAdminToken } from "../../common";
import { addNewTraining } from "../../controllers/teacher-training";

const BrandRouter: express.Router = express.Router();

BrandRouter.post("/add-brand", ValidateMasterAdminToken, addBrand);
BrandRouter.get("/get-brand", ValidateMasterAdminToken, getAllBrand);
BrandRouter.get("/view-brand/:id", ValidateMasterAdminToken, viewBrand);
BrandRouter.put("/delete-brand", ValidateMasterAdminToken, deleteBrand);
BrandRouter.put(
  "/brand-status",
  ValidateMasterAdminToken,
  activateOrDeactiveBrand
);
BrandRouter.put("/:id", ValidateMasterAdminToken, updateBrand);
BrandRouter.post("/assign-task", ValidateMasterAdminToken, assignTasktoBrand);
BrandRouter.get("/view-task/:id", ValidateMasterAdminToken, viewAssignTask);
BrandRouter.put("/mark-task/:id", ValidateMasterAdminToken, maerkAssignTask);
BrandRouter.post("/", ValidateMasterAdminToken, addNewTraining);
BrandRouter.get("/get-task", ValidateMasterAdminToken, getAssignedTaskForBA);

export default BrandRouter;
