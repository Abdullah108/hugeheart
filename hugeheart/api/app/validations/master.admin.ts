import { body, ValidationChain } from "express-validator";
/**
 *
 */
export const AddMasterAdminValidations: ValidationChain[] = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter valid email.")
    .isEmail()
    .withMessage("Please enter valid email.")
    .trim(),
  body("firstName")
    .not()
    .isEmpty()
    .withMessage("Please enter first name.")
    .trim(),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage("Please enter last name.")
    .trim(),
  body("contactNumber")
    .not()
    .isEmpty()
    .withMessage("Please enter contact number.")
    .isLength({ min: 10, max: 10 })
    .withMessage("Contact number should have 10 digits.")
    .trim(),
  body("exactLocation.city")
    .not()
    .isEmpty()
    .withMessage("Please enter city for exact location.")
    .trim(),
  body("exactLocation.country")
    .not()
    .isEmpty()
    .withMessage("Please enter country for exact location.")
    .trim(),
  body("exactLocation.postalCode")
    .not()
    .isEmpty()
    .withMessage("Please enter postal code for exact location.")
    .trim(),
  body("exactLocation.state")
    .not()
    .isEmpty()
    .withMessage("Please enter state for exact location.")
    .trim(),
  body("preferedLocation.city")
    .not()
    .isEmpty()
    .withMessage("Please enter city for prefered location.")
    .trim(),
  body("preferedLocation.country")
    .not()
    .isEmpty()
    .withMessage("Please enter country for prefered location.")
    .trim(),
  body("preferedLocation.postalCode")
    .not()
    .isEmpty()
    .withMessage("Please enter postal code for prefered location.")
    .trim(),
  body("preferedLocation.state")
    .not()
    .isEmpty()
    .withMessage("Please enter state for prefered location.")
    .trim()
];
