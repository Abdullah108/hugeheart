import { UserModel } from "../../models";
import { Types } from "mongoose";
import { Request, Response } from "express";
import { sign as JWTSign } from "jsonwebtoken";

import {
  comparePassword,
  encryptPassword,
  ErrorMessage,
  generateSalt,
  JWTSecrete,
} from "../../common";

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body } = req;
    const { email, password } = body;
    const result: Document[] | null | any = await UserModel.findOne({
      email: req.body.email,
      userRole: "teacher",
    });
    if (result == null) {
      throw {
        code: 400,
        message: "Email Address not found!",
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
      },
      JWTSecrete,
      {
        expiresIn: 86400,
      }
    );

    return res.status(200).json({
      reponseCode: 200,
      data: result,
      token: token,
      success: true,
    });
  } catch (error) {
    console.log(error);
    const code = error.code ? error.code : 500;
    return res.status(code).json({
      code: code,
      message: error.message ? error.message : "Unexpected error occure.",
      success: false,
    });
  }
};
/**
 *
 */
const updatePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, query } = req;
    const { userId: id } = query;
    const { oldPassword, password } = body;
    const user: any = await UserModel.findById(Types.ObjectId(id));
    if (!user) {
      return res.status(401).send({
        message: "User details not found.",
      });
    }
    if (!comparePassword(oldPassword, user.password)) {
      return res.status(400).json({
        message: `Old password is incorrect.`,
      });
    }
    await UserModel.updateOne(
      {
        _id: Types.ObjectId(id),
      },
      {
        password: encryptPassword(password),
      }
    );
    return res.status(200).send({
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 *
 */
export { updatePassword, login };
