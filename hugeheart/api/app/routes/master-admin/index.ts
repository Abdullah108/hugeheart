import express from "express";
import AuthRouter from "./auth";
import { ValidateMasterAdminToken } from "../../common";
import BrandRouter from "./brand.ambassador";
import TMaterialAssignmentRouter from "./teacher.material.assign";
import TeacherMARouter from "./teacher";
import NotificationRouter from "./notification";
import MasterAdminRouter from "./master.admin";
import MessageRouter from "./messages";
import PRINCIPLEROUTER from "./principle";
import StudentRouter from "../students";
import CurriculumRouter from "../curriculum";
import TopicRouter from "../topic";
import PriceGuideRouter from "../price-guide";

const router: express.Router = express.Router();

router.use("/auth", AuthRouter);
router.use("/brand", ValidateMasterAdminToken, BrandRouter);
router.use("/teacher", ValidateMasterAdminToken, TeacherMARouter);
router.use("/notification", ValidateMasterAdminToken, NotificationRouter);
router.use(
  "/teacher-material-assign",
  ValidateMasterAdminToken,
  TMaterialAssignmentRouter
);
router.use("/master-admin", ValidateMasterAdminToken, MasterAdminRouter);
router.use("/message", ValidateMasterAdminToken, MessageRouter);
router.use("/principle", ValidateMasterAdminToken, PRINCIPLEROUTER);
router.use("/students", ValidateMasterAdminToken, StudentRouter);
router.use("/curriculum", ValidateMasterAdminToken, CurriculumRouter);
router.use("/topics", ValidateMasterAdminToken, TopicRouter);
router.use("/price-guide", ValidateMasterAdminToken, PriceGuideRouter);

export default router;
