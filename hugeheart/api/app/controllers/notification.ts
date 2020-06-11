import { Request, Response } from "express";
import { ErrorMessage, Email, AvailiableTemplates } from "../common";
import { NotificationModel, UserModel } from "../models";
import { Document, Types } from "mongoose";

const addNotifications = async (
  req: Request,
  res: Response,
  title: string,
  content: string,
  createdBy: any,
  createdFor: any[],
  url: string
): Promise<any> => {
  try {
    const data = { title, content, createdBy, createdFor, url };
    const notif = new NotificationModel(data);
    const result = await notif.save();
    return result;
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
const getNotification = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { skip, limit, search, selectRole } = query;
    console.log("====================================");
    console.log(currentUser.id);
    console.log("====================================");
    let condition: any = {
      isDeleted: false,
      createdFor: { $in: currentUser.id }
    };
    const priciples = await NotificationModel.find(condition)
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 25);
    const totalNotif = await NotificationModel.countDocuments(condition);
    return res.status(200).send({
      message: "Notification fetched successfully.",
      data: priciples,
      totalNotif
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

export { addNotifications, getNotification };
