import express from "express";
import UserRouter from "./users";
import AuthRouter from "./auth";
import TopicRouter from "./topic";
import SubTopicRouter from "./subtopic";

import { ValidateAdminToken } from "../common";
import MasterAdminRouter from "./master.admin";
import TeacherRouter from "./teacher";
import MaterialRouter from "./material";
import TMAAssignmentRouter from "./teacher.ma.assign";
import TeacherTrainingRouter from "./teacher-training";
import PRINCIPLEROUTER from "./principle";
import BrandRouter from "./brand.ambassador";
import NotificationRouter from "./notification";
import TMaterilAssignmentRouter from "./teacher.material.assign";
import MessageRouter from "./messages";
import FolderRouter from "./folder";
import CurriculumRouter from "./curriculum";
import StudentRouter from "./students";
import DashboardRouter from "./dashboard";
import PriceGuideRouter from "./price-guide";

const router: express.Router = express.Router();

router.use("/users", UserRouter);
router.use("/auth", AuthRouter);

router.use("/topics", ValidateAdminToken, TopicRouter);
router.use("/master-admin", ValidateAdminToken, MasterAdminRouter);
router.use("/teachers", ValidateAdminToken, TeacherRouter);
router.use("/subtopics", ValidateAdminToken, SubTopicRouter);
router.use("/material", ValidateAdminToken, MaterialRouter);
router.use("/teacher-ma", ValidateAdminToken, TMAAssignmentRouter);
router.use("/teacher-training", ValidateAdminToken, TeacherTrainingRouter);
router.use("/brand", ValidateAdminToken, BrandRouter);
router.use(
  "/teacher-material-assign",
  ValidateAdminToken,
  TMaterilAssignmentRouter
);
router.use("/principle", ValidateAdminToken, PRINCIPLEROUTER);
router.use("/notification", ValidateAdminToken, NotificationRouter);
router.use("/message", ValidateAdminToken, MessageRouter);
router.use("/folders", ValidateAdminToken, FolderRouter);
router.use("/curriculum", ValidateAdminToken, CurriculumRouter);
router.use("/students", ValidateAdminToken, StudentRouter);
router.use("/dashboard", ValidateAdminToken, DashboardRouter);
router.use("/price-guide", ValidateAdminToken, PriceGuideRouter);
router.use("/", ValidateAdminToken, PriceGuideRouter);
export default router;
