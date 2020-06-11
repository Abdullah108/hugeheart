import express from "express";
import {getNotification} from "../../controllers";
import { ValidateMasterAdminToken } from "../../common";

const NotificationRouter: express.Router = express.Router();

NotificationRouter.get("/", ValidateMasterAdminToken, getNotification);

export default NotificationRouter;
