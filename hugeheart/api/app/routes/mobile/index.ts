import express from "express";
import AuthRouter from "./auth";
const router: express.Router = express.Router();

router.use("/auth", AuthRouter);

export default router;
