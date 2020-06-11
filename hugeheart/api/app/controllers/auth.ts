import { Request, Response } from "express";
import { UserModel } from "../models";
import {
  comparePassword,
  ErrorMessage,
  encryptPassword,
  generateSalt,
  JWTSecrete,
  ValidationFormatter,
  getIpAddress
} from "../common";
import { Types } from "mongoose";
import { sign as JWTSign } from "jsonwebtoken";
import { validationResult } from "express-validator";

const signUp = async (req: Request, res: Response): Promise<any> => {
  var salt = generateSalt(6);
  var $data = req.body;
  $data.salt = salt;
  $data.password = encryptPassword($data.password, salt);
  $data.role = 1;
  // $data.loggedInIp = config.getIpAddress(req);
  const signUp = new UserModel($data);
  try {
    const result = await signUp.save();

    return res.status(200).json({
      responseCode: 200,
      data: result,
      message: "Succesfully Registered",
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/**
 * Super Admin
 */
const superAdminLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;
    const { email, password } = body;
    const result: Document[] | null | any = await UserModel.findOne({
      email: req.body.email,
      userRole: "superadmin",
      isDeleted: false
    });
    if (result == null) {
      throw {
        code: 400,
        message: "Email Address not found!",
        success: false
      };
    }
    if (!comparePassword(password, result.password)) {
      throw {
        code: 401,
        message: "Password did not match!",
        success: false
      };
    }
    const token = JWTSign(
      {
        id: result.id,
        randomKey: generateSalt(8),
        email: email,
        firstName: result.firstName,
        lastName: result.lastName,
        userRole: result.userRole
      },
      JWTSecrete,
      {
        expiresIn: 86400
      }
    );

    return res.status(200).json({
      reponseCode: 200,
      data: result,
      token: token,
      success: true
    });
  } catch (error) {
    console.log(error);
    const code = error.code ? error.code : 500;
    return res.status(code).json({
      code: code,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/**
 * Super Admin Profile
 */
const adminProfile = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false
    });
  }
  try {
    const { currentUser, body } = req;
    if (currentUser) {
      const users = await UserModel.find({
        email: body.email,
        _id: {
          $ne: currentUser.id
        }
      });
      if (users.length > 0) {
        return res.status(401).json({
          message: "Email already exist",
          success: false
        });
      }
      const result = await UserModel.update(
        {
          _id: currentUser.id
        },
        {
          $set: {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email
          }
        }
      );
      return res.status(200).json({
        responseCode: 200,
        message: "Admin profile updated successfully",
        data: result,
        success: true
      });
    } else {
      return res.status(404).json({
        responseCode: 404,
        message: "User not found",
        success: false
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message ? error.message : "Unexpected error occure.",
      success: false
    });
  }
};

/**
 * Admin ChangePassword
 */
const adminChangePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false
    });
  }
  try {
    const { body, currentUser } = req;
    const users: Document | null | any = await UserModel.findOne({
      _id: currentUser ? currentUser.id : undefined
    });
    if (!comparePassword(body.oldPassword, users.password)) {
      throw {
        code: 400,
        message: "Old Password did not match.",
        success: false
      };
    }
    const salt = generateSalt();
    body.newPassword = encryptPassword(body.newPassword, salt);
    if (currentUser) {
      const result = await UserModel.update(
        {
          _id: currentUser.id
        },
        {
          $set: {
            password: body.newPassword,
            salt: salt
          }
        }
      );
      return res.status(200).json({
        responseCode: 200,
        message: "Password updated successfully.",
        data: result,
        success: true
      });
    } else {
      return res.status(404).json({
        responseCode: 404,
        message: "User not found",
        success: false
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
const updateAdminPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { oldPassword, password } = body;
    const user: any = await UserModel.findById(Types.ObjectId(id));
    if (!user) {
      return res.status(401).send({
        message: "User details not found."
      });
    }
    if (!comparePassword(oldPassword, user.password)) {
      return res.status(400).json({
        message: `Old password is incorrect.`
      });
    }
    await UserModel.updateOne(
      {
        _id: Types.ObjectId(id)
      },
      {
        password: encryptPassword(password)
      }
    );
    return res.status(200).send({
      message: "Password updated successfully."
    });
  } catch (error) {
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
/**
 *
 */
/**
 * MASTER ADMIN PROXY LOGIN
 */

const masterAdminProxyLogin = async (req: Request, res: Response): Promise<any> => {
  const { body, params } = req;
  const { id } = params;
  try {
    const result: Document|null|any = await UserModel.findOne({
      _id: id,
      isDeleted: false,
      //userRole: "masteradmin"
    })
    if (!result) {
      return res.status(404).json({
        responseCode: 404,
        message: "Data not found.",
        success: true
      })
    }
    
    const lastLogin = new Date();
    result.set({
      userId: result._id,
      loginAt: lastLogin,
      loginIP: getIpAddress(req)
      //loginToken: common.generateSalt(20),
    })
    const tokenData = await result.save()
    var token = JWTSign({
      id: result.id,
        randomKey: generateSalt(8),
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        contactNumber: result.contactNumber,
        createdBy: result.createdBy
    }, JWTSecrete, {
        expiresIn: 86400
      });
    return res.status(200).json({
      responseCode: 200,
      token: token,
      message: "Login Successful.",
      success: true
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      responsecode: 500,
      message: error.message ? error.message : 'Unexpected error occure.',
      success: false
    })
  }
}
export {
  signUp,
  superAdminLogin,
  masterAdminProxyLogin,
  adminProfile,
  adminChangePassword,
  updateAdminPassword
};
