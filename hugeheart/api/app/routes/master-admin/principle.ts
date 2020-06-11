import express from "express";
import { getPrinciple } from "./../../controllers/master-admin";

const PRINCIPLEROUTER: express.Router = express.Router();

PRINCIPLEROUTER.get("/", getPrinciple);

export default PRINCIPLEROUTER;
