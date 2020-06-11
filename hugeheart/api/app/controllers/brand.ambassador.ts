import { Request, Response } from "express";
import { UserModel, AssignTaskToBrand } from "../models";
import {
  encryptPassword,
  ErrorMessage,
  ValidationFormatter,
  generatePassword,
  Email,
  AvailiableTemplates,
} from "../common";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import moment from "moment";
import { addNotifications } from ".";
import { AppFrontendURL } from "../config";

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
      createdBy,
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
    const password = encryptPassword(plainPwd);
    const resp = await UserModel.create({
      firstName,
      lastName,
      fullName,
      email,
      contactNumber,
      title,
      password,
      createdBy,
      userRole: "brandamb",
      exactLocation,
    });
    await addNotifications(
      req,
      res,
      `New Brand Ambassador Added`,
      `Super Admin has added ${fullName} as a brand ambassador.`,
      id,
      [createdBy],
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
          link: AppFrontendURL,
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
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 25);
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
    const { firstName, lastName, email, createdBy } = body;
    const user = await UserModel.findOne({
      email,
      isDeleted: false,
      _id: {
        $ne: Types.ObjectId(id),
      },
    });
    try {
      delete body.password;
    } catch (error) {}

    if (user) {
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id.",
      });
    }
    const userData: any = await UserModel.findOne({
      _id: Types.ObjectId(id),
    });
    const fullName = `${firstName} ${lastName}`;
    if (userData.email !== email) {
      try {
        const plainPwd = generatePassword(6);
        const password = encryptPassword(plainPwd);
        body.password = password;

        const emailTemp = new Email(req);
        await emailTemp.setTemplate(
          AvailiableTemplates.BRAND_AMBASSADOR_REFISTRATION,
          {
            full_name: fullName,
            email: email,
            password: plainPwd,
            link: AppFrontendURL,
          }
        );
        await emailTemp.sendEmail(email);
      } catch (error) {
        console.log(error);
      }
    }
    const users = await UserModel.update(
      { _id: id },
      {
        $set: { ...body, fullName },
      }
    );
    await addNotifications(
      req,
      res,
      `Brand Ambassador Details Updated.`,
      `Super Admin has updated brand ambassador ${fullName} details.`,
      id,
      [createdBy],
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
      `Super Admin has deleted brand ambassador.`,
      id,
      [currentUser && currentUser.id],
      `/brand-ambassador/view/${ids}`
    );
    return res.status(200).send({
      message: `Brand ${
        ids.length > 1 ? "Ambassadors" : "Ambassador"
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

/**
 * ASSIGN TASK TO BRAND
 */
const assignTasktoBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false,
      });
    }
    const { body, currentUser } = req;
    const { assignTask, additionalNote, assignDate, userId } = body;

    const { id } = currentUser || {};
    const data = {
      assignTask: assignTask,
      additionalNote: additionalNote,
      assignDate: assignDate,
      userId: userId,
    };
    const task = new AssignTaskToBrand(data);
    const result: any = await task.save();
    const getData: any = await AssignTaskToBrand.findOne({
      _id: result._id,
    }).populate("userId");
    console.log("====================================");
    console.log(getData.userId.email);
    console.log("====================================");
    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(AvailiableTemplates.ASIIGNTASK_TO_BRAND_AMB, {
        full_name: getData.userId.fullName,
        assignTask: assignTask,
        assignDate: moment(assignDate).format("LL"),
        additionalNote: additionalNote,
      });
      await emailTemp.sendEmail(getData.userId.email);
      return res.status(200).send({
        message: "Task assign successfully.",
      });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      return res.status(201).send({
        message: "Task assign successfully. But having issue in sending email.",
      });
    }
    return res.status(200).json({
      responseCode: 200,
      message: "Task assign successfully",
      data: result,
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
    |--------------------------------------------------
    | Get Assign Task
    |--------------------------------------------------
    */

const viewAssignTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    console.log("====================================");
    console.log(id);
    console.log("====================================");
    const task = await AssignTaskToBrand.find({
      userId: id,
      isDeleted: false,
    });
    if (!task) {
      return res.status(404).send({
        message: "Task doesn't exits.",
      });
    }
    return res.status(200).send({
      message: "task data fetched successfully.",
      data: task,
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
|--------------------------------------------------
| Get Assign Task
|--------------------------------------------------
*/

const getAssignedTaskForBA = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { currentUser } = req;
    const { id } = currentUser || {};
    const task = await AssignTaskToBrand.find({
      userId: id,
      isDeleted: false,
    });
    if (!task) {
      return res.status(404).send({
        message: "Task doesn't exits.",
      });
    }
    return res.status(200).send({
      message: "task data fetched successfully.",
      data: task,
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
|--------------------------------------------------
| Markas Assign Task
|--------------------------------------------------
*/

const markAssignTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params, body } = req;
    const { id } = params;
    const task = await AssignTaskToBrand.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          markAs: body.markAs,
          markAsNote: body.markAsNote,
        },
      }
    );
    if (task == null) {
      return res.status(404).send({
        message: "Task doesn't exits.",
      });
    }
    const getData: any = await AssignTaskToBrand.findOne({
      _id: id,
    }).populate("userId");
    console.log("====================================");
    console.log(getData.userId.email);
    console.log("====================================");
    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(AvailiableTemplates.MARK_ASSIGN_TASK, {
        full_name: getData.userId.fullName,
        assignTask: getData.assignTask,
        assignDate: getData.assignDate,
        additionalNote: getData.additionalNote,
        markAs: body.markAs == "completed" ? "completed" : "incompleted",
        markAsNote: body.markAsNote,
      });
      await emailTemp.sendEmail(getData.userId.email);
      return res.status(200).send({
        message: "Task updated successfully.",
      });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      return res.status(201).send({
        message: "Task assign successfully. But having issue in sending email.",
      });
    }
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
  assignTasktoBrand,
  viewAssignTask,
  getAssignedTaskForBA,
  markAssignTask,
};
