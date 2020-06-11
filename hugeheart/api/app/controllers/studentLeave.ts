import { Request, Response } from "express";
import {
  ErrorMessage,
  Email,
  AvailiableTemplates,
  generatePassword,
  encryptPassword,
} from "../common";
import { UserModel, TeacherScheduleModel, StudentLeaveModel } from "../models";
import { addNotifications } from "./notification";
import { getAdminIds } from "./user";
import { AppAdminURL, AppFrontendURL } from "../config";
import { Types } from "mongoose";
//import { moment } from "moment";

/* ------- Request Leave ------- */
export const requestLeave = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body } = req;
    const { adminId, masterAdminId, message, date, status } = body;
    const data = {
      adminId,
      masterAdminId,
      message,
      date,
      status,
    };
    const leaveRequest = new StudentLeaveModel(data);
    const result = await leaveRequest.save();
    return res.status(200).json({
      message: "Student leave request.",
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

/* ------- View Request leave ------ */
export const viewRequestLeave = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const result = await StudentLeaveModel.findOne({
      _id: id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
