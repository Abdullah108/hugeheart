import { Request, Response } from "express";
import {
  UserModel,
  NotificationModel,
  TeacherScheduleModel,
} from "../../models";
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
import { Types, Query } from "mongoose";
import { addNotifications } from "..";

/**
 * ADD Student
 */
const addStudent = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false,
      });
    }
    const { body, currentUser } = req;
    const { firstName, lastName, email, contactNumber, exactLocation } = body;
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
    await UserModel.create({
      firstName,
      lastName,
      fullName,
      email,
      contactNumber,
      password,
      userRole: "student",
      createdBy: id,
      exactLocation,
    });

    await addNotifications(
      req,
      res,
      `New Student Added`,
      `Brand Ambassador has added ${fullName} as a student.`,
      id,
      ["5d978311607b4b1280c33276"],
      ""
    );
    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(AvailiableTemplates.STUDENT_REFISTRATION, {
        full_name: fullName,
        email: email,
        password: plainPwd,
      });
      await emailTemp.sendEmail(email);
      return res.status(200).send({
        message: "Student added successfully.",
      });
    } catch (error) {
      return res.status(201).send({
        message:
          "Student details saved successfully. But having issue in sending email.",
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
 * GET Student
 */
const getAllStudent = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { skip, limit, search, statusActive } = query;
    let condition: any = {
      isDeleted: false,
      userRole: "student",
      createdBy: currentUser && currentUser.id,
    };
    if (search) {
      condition["$or"] = [
        {
          email: {
            $regex: new RegExp(`${search}`, "i"),
          },
        },
        {
          fullName: {
            $regex: new RegExp(`${search}`, "i"),
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
 * View Student
 */
const viewStudent = async (req: Request, res: Response): Promise<any> => {
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
 * Update Student Ambassador
 */

const updateStudent = async (req: Request, res: Response): Promise<any> => {
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
      `Student Details Updated.`,
      `Brand Ambassador has updated student ${fullName} details.`,
      id,
      ["5d978311607b4b1280c33276"],
      ``
    );

    return res.status(200).send({
      message: "Student data updated successfully.",
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
 * Delete Student Ambassador
 */
const deleteStudent = async (req: Request, res: Response): Promise<any> => {
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
      `Student Deleted.`,
      `Brand Ambassador has deleted ${fullName} as a Student.`,
      id,
      ids,
      ``
    );
    console.log("====================================");
    console.log(notification);
    console.log("====================================");
    return res.status(200).send({
      message: `${
        ids.length > 1 ? "Students" : "Student"
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
const activateOrDeactiveStudent = async (
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
        ? `${ids.length > 1 ? "Students" : "Student"} activated successfully.`
        : `${
            ids.length > 1 ? "Students" : "Student"
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
 *
 */
export {
  addStudent,
  getAllStudent,
  viewStudent,
  updateStudent,
  deleteStudent,
  activateOrDeactiveStudent,
};
