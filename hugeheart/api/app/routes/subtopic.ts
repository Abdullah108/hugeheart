import express from "express";
import {
    addSubTopic, 
    getAllSubTopic
} from "./../controllers";
import { SubTopicValidations } from './../validations/'

const SubTopicRouter: express.Router = express.Router();

SubTopicRouter.get("/",  getAllSubTopic);
SubTopicRouter.post("/",  SubTopicValidations, addSubTopic);
export default SubTopicRouter;
