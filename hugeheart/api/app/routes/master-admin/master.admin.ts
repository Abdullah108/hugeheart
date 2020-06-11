import express from "express";
import { getSuperAdmins } from "./../../controllers";
import { getAllMasterAdmins } from "../../controllers/master-admin";

const MasterAdminRouter: express.Router = express.Router();

MasterAdminRouter.get("/", getAllMasterAdmins);
MasterAdminRouter.get("/superadmin", getSuperAdmins);

export default MasterAdminRouter;
