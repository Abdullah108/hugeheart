import express from "express";
import { updatePriceGuide, getPriceGuide } from "../controllers";

const PriceGuideRouter: express.Router = express.Router();

PriceGuideRouter.get("/", getPriceGuide);
PriceGuideRouter.put("/", updatePriceGuide);

export default PriceGuideRouter;
