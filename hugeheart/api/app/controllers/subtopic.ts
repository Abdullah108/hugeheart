import { Request, Response } from "express";
import { ErrorMessage, ValidationFormatter } from "../common";
import { SubTopicModel } from "../models";
import { validationResult } from "express-validator";

/**
 *
 * @param req
 * @param res
 * @description get all topic data
 */
const getAllSubTopic = async (req: Request, res: Response): Promise<any> => {
  try {
    const topics = await SubTopicModel.find({ topicId: req.query.topicId });
    return res.status(200).send({
      message: "Subtopics data fetched successfully.",
      data: topics,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

const addSubTopic = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false,
      });
    }
    let subTopic = new SubTopicModel(req.body);
    await subTopic.save();
    return res.status(200).send({
      message: "Sub Topic saved successfully.",
      data: subTopic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

export { addSubTopic, getAllSubTopic };
