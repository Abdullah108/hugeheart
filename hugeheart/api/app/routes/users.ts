import express from "express";
import { getAdminProfileDetails, updateAdminProfile } from "./../controllers";
import { ValidateAdminToken } from "../common";
const UserRouter: express.Router = express.Router();

UserRouter.get("/details", ValidateAdminToken, getAdminProfileDetails);
UserRouter.post("/update", ValidateAdminToken, updateAdminProfile);

export default UserRouter;
