import express from "express";
import {
  masterAdminLogin,
  getMasterAdminProfileDetails,
  updateMasterAdminProfile,
  masterAdminChangePassword,
} from "../../controllers/master-admin";

import { ValidateMasterAdminToken } from "../../common";

const AuthRouter: express.Router = express.Router();

AuthRouter.post("/login", masterAdminLogin);
AuthRouter.get(
  "/profile",
  ValidateMasterAdminToken,
  getMasterAdminProfileDetails
);
AuthRouter.put(
  "/update-profile",
  ValidateMasterAdminToken,
  updateMasterAdminProfile
);
AuthRouter.put(
  "/change-password",
  ValidateMasterAdminToken,
  masterAdminChangePassword
);

export default AuthRouter;
