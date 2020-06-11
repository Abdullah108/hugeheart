import {
  ErrorMessage,
  ValidationFormatter,
  Email,
  AvailiableTemplates,
  encryptPassword,
  generatePassword
} from "../common";
import { Request, Response } from "express";
import { UserModel } from "../models";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import { AppFrontendURL } from "../config";

/**
 *
 */
const getAllMasterAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const { skip, limit, search, statusActive } = query;
    let condition: any = {
      isDeleted: false,
      userRole: "masteradmin"
    };
    if (search) {
      condition["$or"] = [
        {
          email: {
            $regex: new RegExp(search, "i")
          }
        },
        {
          fullName: {
            $regex: new RegExp(search, "i")
          }
        }
      ];
    }
    if (statusActive) {
      condition.isActive = statusActive == "true" ? "true" : "false";
    }
    const users = await UserModel.find(condition)
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 25);
    const totalUsers = await UserModel.countDocuments(condition);
    return res.status(200).send({
      message: "Users data fetched successfully.",
      data: users,
      totalUsers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

/**
 *
 */
const addNewMasterAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false
      });
    }
    const { body, currentUser } = req;
    const {
      firstName,
      lastName,
      email,
      childrenCheckNumber,
      contactNumber,
      experienceInBusiness: experiance,
      expiryDateChildrenWorking,
      contractTerm,
      exactLocation,
      preferedLocation
    } = body;
    const user = await UserModel.findOne({
      email,
      isDeleted: false
    });

    if (user) {
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id."
      });
    }

    const fullName = `${firstName} ${lastName}`;
    const { id } = currentUser || {};
    const plainPwd = generatePassword(6);
    const password = encryptPassword(plainPwd);
    await UserModel.create({
      firstName,
      lastName,
      fullName,
      email,
      password,
      workingWithStudent: childrenCheckNumber,
      contactNumber,
      experiance,
      workingWithStudentExpirationDate: new Date(expiryDateChildrenWorking),
      liscenceStartDate: new Date(contractTerm[0]),
      liscenceEndDate: new Date(contractTerm[1]),
      exactLocation,
      preferedLocation,
      userRole: "masteradmin",
      createdBy: id
    });
    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(
        AvailiableTemplates.MASTER_ADMIN_REGISTRATION,
        {
          full_name: fullName,
          email: email,
          password: plainPwd,
          link: AppFrontendURL
        }
      );
      await emailTemp.sendEmail(email);
      return res.status(200).send({
        message: "Master admin details saved successfully."
      });
    } catch (error) {
      return res.status(201).send({
        message:
          "Master admin details saved successfully. But having issue in sending email."
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
/**
 *
 */

const updateMasterAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false
      });
    }
    const { body, currentUser, params } = req;
    const { id } = params;
    const {
      firstName,
      lastName,
      email,
      childrenCheckNumber,
      contactNumber,
      experienceInBusiness: experiance,
      expiryDateChildrenWorking,
      contractTerm,
      exactLocation,
      preferedLocation
    } = body;
    const user = await UserModel.findOne({
      email,
      isDeleted: false,
      _id: {
        $ne: Types.ObjectId(id)
      }
    });

    if (user) {
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id."
      });
    }
    const fullName = `${firstName} ${lastName}`;
    const { id: userId } = currentUser || {};
    const updatedObj: any = {
      firstName,
      lastName,
      fullName,
      email,
      workingWithStudent: childrenCheckNumber,
      contactNumber,
      experiance,
      workingWithStudentExpirationDate: new Date(expiryDateChildrenWorking),
      liscenceStartDate: new Date(contractTerm[0]),
      liscenceEndDate: new Date(contractTerm[1]),
      exactLocation,
      preferedLocation,
      userRole: "masteradmin",
      createdBy: userId
    };
    const userDetails: any = await UserModel.findById(id);
    if (userDetails.email !== email) {
      try {
        const plainPwd = generatePassword(6);
        const password = encryptPassword(plainPwd);
        updatedObj["password"] = password;
        const emailTemp = new Email(req);
        await emailTemp.setTemplate(
          AvailiableTemplates.MASTER_ADMIN_REGISTRATION,
          {
            full_name: fullName,
            email: email,
            password: plainPwd,
            link: AppFrontendURL
          }
        );
        await emailTemp.sendEmail(email);
      } catch (error) { }
    }
    await UserModel.updateOne(
      {
        _id: Types.ObjectId(id)
      },
      {
        $set: updatedObj
      }
    );
    return res.status(200).send({
      message: "Master admin details saved successfully."
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
/**
 *
 */
const deletMasterAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids } = body;
    await UserModel.deleteMany({
      _id: {
        $in: ids
      },
      userRole: "masteradmin"
    });
    return res.status(200).send({
      message: `Master ${
        ids.length > 1 ? "admins" : "admin"
        } deleted successfully.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
/**
 *
 */
const activateOrDeactiveMasterAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids, isActive } = body;
    await UserModel.updateMany(
      {
        _id: {
          $in: ids
        },
        userRole: "masteradmin"
      },
      {
        isActive,
        updatedAt: new Date(),
        updatedBy: id
      }
    );
    return res.status(200).send({
      message: isActive
        ? `Master ${
        ids.length > 1 ? "admins" : "admin"
        } activated successfully.`
        : `Master ${
        ids.length > 1 ? "admins" : "admin"
        } deactivated successfully.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
/**
 *
 */
const getMasterAdminDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const user = await UserModel.findOne({
      _id: id,
      userRole: "masteradmin",
      isDeleted: false
    });
    if (!user) {
      return res.status(404).send({
        message: "User doesn't exits."
      });
    }
    return res.status(200).send({
      message: "Master admin details fetchd successfully.",
      data: user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
/**
 *
 */
export {
  getAllMasterAdmin,
  addNewMasterAdmin,
  updateMasterAdmin,
  deletMasterAdmin,
  activateOrDeactiveMasterAdmin,
  getMasterAdminDetails
};
