import { Request, Response } from "express";
import { UserModel, NotificationModel } from "../../models";
import {
  encryptPassword,
  generateSalt,
  ErrorMessage,
  ValidationFormatter,
  generatePassword,
  Email,
  AvailiableTemplates,
} from "../../common";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import { addNotifications } from "..";

/**
 * ADD BRAND
 */
const addBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false,
      });
    }
    const { body, currentUser } = req;
    const {
      firstName,
      lastName,
      email,
      title,
      contactNumber,
      exactLocation,
    } = body;
    const user = await UserModel.findOne({
      email,
      isDeleted: false,
    });

    if (user) {
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id.",
      });
    }

    const fullName = `${firstName} ${lastName}`;
    const { id } = currentUser || {};
    const plainPwd = generatePassword(6);
    console.log(plainPwd);
    const password = encryptPassword(plainPwd);
    const resp = await UserModel.create({
      firstName,
      lastName,
      fullName,
      email,
      contactNumber,
      title,
      password,
      userRole: "brandamb",
      createdBy: id,
      exactLocation,
    });

    await addNotifications(
      req,
      res,
      `New Brand Ambassador Added`,
      `Master Admin has added ${fullName} as a brand ambassador.`,
      id,
      ["5d978311607b4b1280c33276"],
      `/brand-ambassador/view/${resp._id}`
    );
    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(
        AvailiableTemplates.BRAND_AMBASSADOR_REFISTRATION,
        {
          full_name: fullName,
          email: email,
          password: plainPwd,
        }
      );
      await emailTemp.sendEmail(email);
      return res.status(200).send({
        message: "Brand Ambassador added successfully.",
      });
    } catch (error) {
      return res.status(201).send({
        message:
          "Brand Ambassador details saved successfully. But having issue in sending email.",
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
 * GET BRAND
 */
const getAllBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { skip, limit, search, statusActive } = query;
    let condition: any = {
      isDeleted: false,
      userRole: "brandamb",
      createdBy: currentUser && currentUser.id,
    };
    if (search) {
      condition["$or"] = [
        {
          email: {
            $regex: new RegExp(search, "i"),
          },
        },
        {
          fullName: {
            $regex: new RegExp(search, "i"),
          },
        },
      ];
    }
    if (statusActive) {
      condition.isActive = statusActive == "true" ? "true" : "false";
    }
    const users = await UserModel.find(condition)
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 25)
      .sort({ createdAt: -1 });
    const totalUsers = await UserModel.countDocuments(condition);
    return res.status(200).send({
      message: "Users data fetched successfully.",
      data: users,
      totalUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 * GET BRAND
 */
const viewBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const users = await UserModel.findOne({ _id: id, isDeleted: false });
    if (!users) {
      return res.status(404).send({
        message: "User doesn't exits.",
      });
    }
    return res.status(200).send({
      message: "Users data fetched successfully.",
      data: users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 * Update BRAND Ambassador
 */

const updateBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, params } = req;
    const { id } = params;
    const { firstName, lastName, email } = body;
    const user: any = await UserModel.findOne({
      email,
      isDeleted: false,
      _id: {
        $ne: Types.ObjectId(id),
      },
    });
    console.log("====================================");
    console.log(user);
    console.log("====================================");

    if (user) {
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id.",
      });
    }
    const fullName = `${firstName} ${lastName}`;
    const users = await UserModel.update(
      { _id: id },
      {
        $set: { ...body, fullName },
      }
    );
    const notification = await addNotifications(
      req,
      res,
      `Brand Ambassador Details Updated.`,
      `Master Admin has updated brand ambassador ${fullName} details.`,
      id,
      ["5d978311607b4b1280c33276"],
      `/brand-ambassador/view/${id}`
    );

    return res.status(200).send({
      message: "Users data updated successfully.",
      data: users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 * Delete BRAND Ambassador
 */
const deleteBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids, fullName } = body;
    await UserModel.deleteMany({
      _id: {
        $in: ids,
      },
    });
    const notification = await addNotifications(
      req,
      res,
      `Brand Ambassador Deleted.`,
      `Master Admin has deleted ${fullName} as a brand ambassador.`,
      id,
      ids,
      `/brand-ambassador/view/${ids}`
    );
    console.log("====================================");
    console.log(notification);
    console.log("====================================");
    return res.status(200).send({
      message: `Master ${
        ids.length > 1 ? "admins" : "admin"
      } deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
/**
 * Active/Deactive
 */
const activateOrDeactiveBrand = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids, isActive } = body;
    console.log(ids);
    await UserModel.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        isActive,
        updatedAt: new Date(),
        updatedBy: id,
      }
    );
    return res.status(200).send({
      message: isActive
        ? `Brand ${
            ids.length > 1 ? "ambassadors" : "ambassador"
          } activated successfully.`
        : `Brand ${
            ids.length > 1 ? "ambassadors" : "ambassador"
          } deactivated successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

export {
  addBrand,
  getAllBrand,
  viewBrand,
  updateBrand,
  deleteBrand,
  activateOrDeactiveBrand,
};
