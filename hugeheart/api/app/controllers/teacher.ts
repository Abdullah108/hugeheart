import { Request, Response } from "express";
import {
  UserModel,
  TeacherMaterialAssignModel,
  TeacherScheduleModel,
  TeacherCurriculumAssignModel
} from "../models";
import {
  ErrorMessage,
  AvailiableTemplates,
  Email,
  generatePassword,
  encryptPassword,
  ValidationFormatter
} from "../common";
import { validationResult } from "express-validator";
import { FileStoragePath, FilteStorageFolder, AppFrontendURL } from "../config";
import fs from "fs";
import { Types } from "mongoose";
import { addNotifications } from ".";
import moment from "moment";
/**
 *
 */
const getTeachers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const { skip, limit, search, statusActive } = query;
    let condition: any = {
      isDeleted: false,
      userRole: "teacher"
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
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 25)
      .sort({
        createdAt: -1
      });
    const totalUsers = await UserModel.countDocuments(condition);
    return res.status(200).send({
      message: "Teacher's data fetched successfully.",
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
const addNewTeacher = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false
      });
    }
    const { body, currentUser } = req;
    let files = req.files as any;
    let resumeFile = files["resume"] ? files["resume"][0] : null;
    let profileImageFile = files["profileImage"]
      ? files["profileImage"][0]
      : null;
    if (!resumeFile) {
      resumeFile = {};
    }
    if (!profileImageFile) {
      profileImageFile = {};
    }
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      availibility,
      currentAddress,
      pastExperience,
      educationDetails,
      emergencyContactNumber,
      emergencyEmail,
      selectedSubjects,
      selectedFolders,
      selectedCurriculumFolders
      //resume
    } = body;
    const user = await UserModel.findOne({
      email,
      isDeleted: false
    });

    if (user) {
      try {
        fs.unlinkSync(`${FileStoragePath}/${profileImageFile.filename}`);
        fs.unlinkSync(`${FileStoragePath}/${resumeFile.filename}`);
      } catch (error) {}
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id."
      });
    }

    const fullName = `${firstName} ${lastName}`;
    const { id } = currentUser || {};
    const plainPwd = generatePassword(6);
    const password = encryptPassword(plainPwd);
    const result = await UserModel.create({
      firstName,
      lastName,
      fullName,
      email,
      password,
      contactNumber,
      availibility: JSON.parse(availibility || "[]"),
      currentAddress,
      pastExperience: JSON.parse(pastExperience || "[]"),
      educationDetails: JSON.parse(educationDetails || "[]"),
      emergencyContactNumber,
      emergencyEmail,
      selectedSubjects: JSON.parse(selectedSubjects || "[]"),
      profileImageURL: profileImageFile.filename
        ? `/${FilteStorageFolder}/${profileImageFile.filename}`
        : undefined,
      resume: resumeFile.filename
        ? `/${FilteStorageFolder}/${resumeFile.filename}`
        : undefined,
      userRole: "teacher",
      createdBy: id
    });
    //
    const materialItem: any[] = [];
    selectedFolders &&
      selectedFolders.split(",").forEach((mat: any) => {
        materialItem.push({
          teacherId: result._id,
          folderId: mat,
          createdBy: id
        });
      });
    await TeacherMaterialAssignModel.create(materialItem);
    //
    const curriculumtItems: any[] = [];
    selectedCurriculumFolders &&
      selectedCurriculumFolders.split(",").forEach((mat: any) => {
        curriculumtItems.push({
          teacherId: result._id,
          folderId: mat,
          createdBy: id
        });
      });
    await TeacherCurriculumAssignModel.create(curriculumtItems);
    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(AvailiableTemplates.TEACHER_REGISTRATION, {
        full_name: fullName,
        email: email,
        password: plainPwd,
        link: AppFrontendURL
      });
      await emailTemp.sendEmail(email);
      return res.status(200).send({
        message: "Teacher's details saved successfully."
      });
    } catch (error) {
      console.log(error);
      return res.status(201).send({
        message:
          "Teacher's details saved successfully. But having issue in sending email."
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
export const updateTeacher = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false
      });
    }
    const { body, currentUser, file, params } = req;
    let files = req.files as any;
    let resumeFile = files["resume"] ? files["resume"][0] : undefined;
    let profileImageFile = files["profileImage"]
      ? files["profileImage"][0]
      : undefined;
    if (!resumeFile) {
      resumeFile = {};
    }
    if (!profileImageFile) {
      profileImageFile = {};
    }
    const { id } = params;
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      availibility,
      currentAddress,
      pastExperience,
      educationDetails,
      emergencyContactNumber,
      emergencyEmail,
      selectedSubjects,
      selectedFolders,
      selectedCurriculumFolders
      //resume
    } = body;
    const user = await UserModel.findOne({
      email,
      isDeleted: false,
      _id: {
        $ne: Types.ObjectId(id)
      }
    });
    if (user) {
      try {
        if (profileImageFile.filename) {
          fs.unlinkSync(`${FileStoragePath}/${profileImageFile.filename}`);
        }
        if (resumeFile.filename) {
          fs.unlinkSync(`${FileStoragePath}/${resumeFile.filename}`);
        }
      } catch (error) {}
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id."
      });
    }
    const fullName = `${firstName} ${lastName}`;
    const { id: userId } = currentUser || {};
    const updatObject: any = {
      firstName,
      lastName,
      fullName,
      email,
      contactNumber,
      availibility: JSON.parse(availibility || "[]"),
      currentAddress,
      pastExperience: JSON.parse(pastExperience || "[]"),
      educationDetails: JSON.parse(educationDetails || "[]"),
      emergencyContactNumber,
      emergencyEmail,
      selectedSubjects: JSON.parse(selectedSubjects || "[]"),
      userRole: "teacher",
      createdBy: userId
    };
    if (profileImageFile.filename) {
      updatObject[
        "profileImageURL"
      ] = `/${FilteStorageFolder}/${file.filename}`;
    }
    if (resumeFile.filename) {
      updatObject["resume"] = `/${FilteStorageFolder}/${resumeFile.filename}`;
    }
    const userDetails: any = await UserModel.findById(id);
    if (userDetails.email !== email) {
      try {
        const plainPwd = generatePassword(6);
        const password = encryptPassword(plainPwd);
        updatObject["password"] = password;
        const emailTemp = new Email(req);
        await emailTemp.setTemplate(AvailiableTemplates.TEACHER_REGISTRATION, {
          full_name: fullName,
          email: email,
          password: plainPwd,
          link: AppFrontendURL
        });
        await emailTemp.sendEmail(email);
      } catch (error) {}
    }
    await UserModel.updateOne(
      {
        _id: id
      },
      {
        $set: updatObject
      }
    );
    //
    await TeacherMaterialAssignModel.deleteMany({
      teacherId: id
    });
    const materialItem: any[] = [];
    selectedFolders &&
      selectedFolders.split(",").forEach((mat: any) => {
        materialItem.push({
          teacherId: id,
          folderId: mat,
          createdBy: userId
        });
      });
    await TeacherMaterialAssignModel.create(materialItem);
    //
    await TeacherCurriculumAssignModel.deleteMany({
      teacherId: id
    });
    const curriculumtItems: any[] = [];
    selectedCurriculumFolders &&
      selectedCurriculumFolders.split(",").forEach((mat: any) => {
        curriculumtItems.push({
          teacherId: id,
          folderId: mat,
          createdBy: userId
        });
      });
    await TeacherCurriculumAssignModel.create(curriculumtItems);
    try {
      await addNotifications(
        req,
        res,
        `Details updated by super admin.`,
        `Super Admin has updated teacher details.`,
        id,
        [id],
        `/teacher/view/${id}`
      );
    } catch (error) {
      console.log(error);
    }
    return res.status(200).send({
      message: "Teacher's details updated successfully."
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
const deleteTeacher = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids } = body;
    await UserModel.deleteMany({
      _id: {
        $in: ids
      },
      userRole: "teacher"
    });
    return res.status(200).send({
      message: `${
        ids.length > 1 ? "Teacher" : "Teachers"
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
const activateOrDeactiveTeacher = async (
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
        userRole: "teacher"
      },
      {
        isActive,
        updatedAt: new Date(),
        updatedBy: id
      }
    );
    return res.status(200).send({
      message: isActive
        ? `${ids.length > 1 ? "Teacher" : "Teachers"} activated successfully.`
        : `${ids.length > 1 ? "Teacher" : "Teachers"} deactivated successfully.`
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
const getTeacherDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const user = await UserModel.findOne({
      _id: id,
      isDeleted: false,
      userRole: "teacher"
    });
    if (!user) {
      return res.status(404).send({
        message: "User doesn't exits."
      });
    }
    const userData: any = user;
    const selectedFolders = await TeacherMaterialAssignModel.find({
      teacherId: id,
      assignmentStatus: "assigned"
    });
    const selectedCurriclumFolders = await TeacherCurriculumAssignModel.find({
      teacherId: id,
      assignmentStatus: "assigned"
    });
    console.log(selectedFolders);
    return res.status(200).send({
      message: "Teacher's details fetched successfully.",
      data: {
        ...userData._doc,
        selectedFolders,
        selectedCurriclumFolders
      }
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
const getTeacherSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query } = req;
    let { id, startDate, endDate } = query;
    if (!startDate) {
      startDate = new Date();
    }
    if (!endDate) {
      endDate = new Date(
        moment()
          .startOf("month")
          .format("YYYY-MM-DD")
      );
    }
    const schedule = await TeacherScheduleModel.find({
      teacherId: id,
      isDeleted: false,
      $and: [
        {
          date: { $gte: new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)) }
        },
        {
          date: {
            $lte: new Date(new Date(endDate).setUTCHours(23, 59, 59, 999))
          }
        }
      ]
    }).populate("studentId");
    const newSchedule = schedule.filter((sch: any) => {
      return sch.studentId && sch.studentId._id && sch.studentId.email;
    });
    return res.status(200).send({
      message: "Teacher's details fetched successfully.",
      data: newSchedule
    });
  } catch (error) {
    console.log("get schedule", error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
/**
 *
 */
/**
 *
 */
export const getDashboardTeacherSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { id: teacherId, userRole } = currentUser;
    console.log("teacherId", teacherId);

    const { startDate, endDate } = query;
    const data: any = await TeacherScheduleModel.find({
      teacherId: userRole == "teacher" ? teacherId : query.teacherId,
      $and: [
        {
          date: {
            $gte: new Date(new Date(startDate).setUTCHours(0, 0, 0))
          }
        },
        {
          date: {
            $lte: new Date(new Date(endDate).setUTCHours(11, 59, 999))
          }
        }
      ]
    }).populate("studentId");
    return res.status(200).send({
      message: "Teacher Schedule fetched successfully.",
      success: true,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

const leaveStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params, body } = req;
    const { status } = body;
    const { id } = params;
    const result = await TeacherScheduleModel.update(
      {
        teacherId: id
      },
      {
        $set: {
          status: status
        }
      }
    );
    return res.status(200).json({
      message: "Leave status successfuly",
      data: result,
      success: true
    });
  } catch (error) {
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

export {
  getTeachers,
  addNewTeacher,
  deleteTeacher,
  activateOrDeactiveTeacher,
  getTeacherDetails,
  getTeacherSchedule,
  leaveStatus
};
