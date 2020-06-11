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
  markAssignTask,
  addNewTraining,
  getAssignedTaskForBA
} from "../controllers";

const BrandRouter: express.Router = express.Router();

BrandRouter.post("/add-brand", addBrand);
BrandRouter.get("/get-brand", getAllBrand);
BrandRouter.get("/view-brand/:id", viewBrand);
BrandRouter.put("/delete-brand", deleteBrand);
BrandRouter.put("/brand-status", activateOrDeactiveBrand);
BrandRouter.put("/:id", updateBrand);
BrandRouter.post("/assign-task", assignTasktoBrand);
BrandRouter.get("/view-task/:id", viewAssignTask);
BrandRouter.put("/mark-task/:id", markAssignTask);
BrandRouter.post("/", addNewTraining);
BrandRouter.get("/get-task", getAssignedTaskForBA);

export default BrandRouter;
