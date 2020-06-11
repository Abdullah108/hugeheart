import { Request, Response } from "express";
import { ErrorMessage, ValidationFormatter } from "../common";
import { TopicModel } from "../models";
import { validationResult } from "express-validator";

/**
 *
 * @param req
 * @param res
 * @description get all topic data
 */
const getAllTopic = async (req: Request, res: Response): Promise<any> => {
  try {
    const topics = await TopicModel.find();
    return res.status(200).send({
      message: "Topics data fetched successfully.",
      data: topics,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

const addTopic = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false,
      });
    }
    let topic = new TopicModel(req.body);
    await topic.save();
    return res.status(200).send({
      message: "Topics saved successfully.",
      data: topic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

export { addTopic, getAllTopic };
