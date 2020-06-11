import express from "express";
import { addTopic, getAllTopic } from "./../controllers";

import { TopicValidations } from "./../validations/";

const TopicRouter: express.Router = express.Router();

TopicRouter.get("/", getAllTopic);
TopicRouter.post("/", TopicValidations, addTopic);
export default TopicRouter;
