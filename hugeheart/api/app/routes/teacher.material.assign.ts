import express from "express";
import {
  assignMaterial,
  getAssignedMaterials,
  removeMaterialFromTeacher
} from "./../controllers";
const TMaterialAssignmentRouter: express.Router = express.Router();

TMaterialAssignmentRouter.patch("/:id", assignMaterial);
TMaterialAssignmentRouter.delete("/:id", removeMaterialFromTeacher);
TMaterialAssignmentRouter.get("/:id", getAssignedMaterials);
/**
 *
 */
export default TMaterialAssignmentRouter;
