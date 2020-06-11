import { body, ValidationChain } from "express-validator";

export const TopicValidations: ValidationChain[] = [

body("name")
.not()
.isEmpty()
.withMessage("Please enter topic name.")
.trim()
]