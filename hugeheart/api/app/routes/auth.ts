import express from "express";

import {
  superAdminLogin,
  signUp,
  adminProfile,
  adminChangePassword,
  updateAdminPassword
} from "./../controllers";
import { LoginValidation } from "../validations";
import { ValidateAdminToken } from "../common";
import { masterAdminProxyLogin } from "../controllers";
const AuthRouter: express.Router = express.Router();

AuthRouter.post("/signUp", LoginValidation, signUp);
AuthRouter.post("/login", LoginValidation, superAdminLogin);
AuthRouter.post("/proxy-login/:id", masterAdminProxyLogin)
AuthRouter.post("/update-password", ValidateAdminToken, updateAdminPassword);
AuthRouter.put("/admin-profile", ValidateAdminToken, adminProfile);
AuthRouter.put("/change-password", ValidateAdminToken, adminChangePassword);

export default AuthRouter;
