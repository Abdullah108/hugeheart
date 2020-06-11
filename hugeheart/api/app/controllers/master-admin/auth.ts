import { Request, Response } from "express";
import { UserModel, LoginArchiveModel } from "../../models";
import {
  comparePassword,
  ErrorMessage,
  GenerateToken,
  encryptPassword,
  generateSalt,
  JWTSecrete,
  ValidationFormatter,
  getIpAddress,
} from "../../common";
import { Types } from "mongoose";
import { sign as JWTSign } from "jsonwebtoken";
import { validationResult } from "express-validator";
import { addNotifications } from "..";
import { log } from "util";

/**
 * MASTER ADMIN LOGIN
 */

const masterAdminLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;
    const { email, password } = body;
    const result: Document | null | any = await UserModel.findOne({
      email: req.body.email,
      userRole: {
        $ne: "superadmin",
      },
      isDeleted: false,
    });
    if (result == null) {
      throw {
        code: 400,
        message: "Email Address not found!",
        success: false,
      };
    }
    if (!result.isActive) {
      throw {
        code: 401,
        message:
          "You account is disbaled by superadmin. Please contact for more information.",
        success: false,
      };
    }
    if (!comparePassword(password, result.password)) {
      throw {
        code: 401,
        message: "Password did not match!",
        success: false,
      };
    }
    const token = JWTSign(
      {
        id: result.id,
        randomKey: generateSalt(8),
        email: email,
        firstName: result.firstName,
        lastName: result.lastName,
        contactNumber: result.contactNumber,
        createdBy: result.createdBy,
      },
      JWTSecrete,
      {
        expiresIn: 86400,
      }
    );
    const lastLogin = new Date();
    await UserModel.updateOne(
      {
        _id: result._id,
      },
      {
        $set: {
          lastLogin,
        },
      }
    );
    await LoginArchiveModel.create({
      userId: result._id,
      loginAt: lastLogin,
      loginIP: getIpAddress(req),
    });
    return res.status(200).json({
      reponseCode: 200,
      data: {
        ...result._doc,
        lastLogin,
      },
      token: token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    const code = error.code ? error.code : 500;
    res.status(code).json({
      code: code,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

/**
 *
 */
const getMasterAdminProfileDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { currentUser } = req;
    const { id } = currentUser || {};
    console.log(currentUser);
    const data: Document | null | any = await UserModel.findOne({
      isDeleted: false,
      _id: Types.ObjectId(id),
    });
    return res.status(200).send({
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 * Master Admin Profile
 */
const masterAdminProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { currentUser, body } = req;
    if (currentUser) {
      const users = await UserModel.find({
        email: body.email,
        _id: {
          $ne: currentUser.id,
        },
      });
      if (users.length > 0) {
        return res.status(401).json({
          message: "Email already exist",
          success: false,
        });
      }
      const result = await UserModel.update(
        {
          _id: currentUser.id,
        },
        {
          $set: {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
          },
        }
      );
      return res.status(200).json({
        responseCode: 200,
        message: "Master Admin profile updated successfully",
        data: result,
        success: true,
      });
    } else {
      return res.status(404).json({
        responseCode: 404,
        message: "User not found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};

/**
 * Admin ChangePassword
 */
const masterAdminChangePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, currentUser } = req;
    const users: Document | null | any = await UserModel.findOne({
      _id: currentUser ? currentUser.id : undefined,
    });
    if (!comparePassword(body.oldPassword, users.password)) {
      return res.status(400).json({
        responseCode: 400,
        message: "Old Password did not match",
        success: false,
      });
    }
    const salt = generateSalt();
    body.password = encryptPassword(body.password, salt);
    if (currentUser) {
      const result = await UserModel.update(
        {
          _id: currentUser.id,
        },
        {
          $set: {
            password: body.password,
            salt: salt,
          },
        }
      );
      return res.status(200).json({
        responseCode: 200,
        message: "Password updated successfully.",
        data: result,
        success: true,
      });
    } else {
      return res.status(404).json({
        responseCode: 404,
        message: "User not found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 * For updating master admin profile
 */
const updateMasterAdminProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { firstName, lastName, email } = body;
    const fullName = `${firstName} ${lastName}`;
    await UserModel.updateOne(
      {
        _id: Types.ObjectId(id),
      },
      {
        firstName,
        lastName,
        fullName,
        email,
      }
    );
    const superAdmin: any = await UserModel.find({
      userRole: "superadmin",
    });
    let superAdminIds = [];
    for (let i = 0; i < superAdmin.length; i++) {
      const element = superAdmin[i];
      superAdminIds.push(element._id);
    }

    await addNotifications(
      req,
      res,
      `Update profile.`,
      `${firstName} ${lastName} has updated their details.`,
      id,
      [superAdminIds],
      ``
    );
    return res.status(200).send({
      message: "User details updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

export {
  masterAdminLogin,
  masterAdminProfile,
  getMasterAdminProfileDetails,
  updateMasterAdminProfile,
  masterAdminChangePassword,
};
