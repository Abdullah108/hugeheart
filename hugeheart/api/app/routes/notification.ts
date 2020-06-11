import express from "express";
import {getNotification} from "./../controllers";

const NotificationRouter: express.Router = express.Router();

NotificationRouter.get("/", getNotification);

export default NotificationRouter;
