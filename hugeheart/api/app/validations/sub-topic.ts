import { body, ValidationChain } from "express-validator";

export const SubTopicValidations: ValidationChain[] = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("Please enter sub topic name.")
    .trim(),

  body("topicId").not().isEmpty().withMessage("Please enter topic id.").trim(),
];
