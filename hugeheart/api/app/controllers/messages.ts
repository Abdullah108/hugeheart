import { ErrorMessage } from "../common";
import { Response, Request } from "express";
import { MessageModel } from "../models";
import { addNotifications } from "./";
import { ContactFilteStorageFolder } from "../config";

// import { getAdminIds } from "./user";
/**
 *
 */
export const sendTextMessage = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {
    const { body, currentUser, file } = req;
    const { message, recieverId } = body;
    const { id, fullName, firstName, lastName, userRole } = currentUser;
    const recieverIds =
      typeof recieverId === "string" ? [recieverId] : recieverId;
    // const adminIds = userRole === "superadmin" ? [] : await getAdminIds();
    const adminIds: string[] = [];


    let attachement = "";

    if (file && file.filename) {
      attachement = `/${ContactFilteStorageFolder}/${file.filename}`; // remove this line if file name need to rename
    }

    await MessageModel.create({
      message,
      attachement,
      senderId: id,
      recieverIds: [...recieverIds, ...adminIds]
    });
    await addNotifications(
      req,
      res,
      `New message`,
      `You have a new message from ${fullName || `${firstName} ${lastName}`}.`,
      id,
      [...recieverIds, ...adminIds],
      `/contact`
    );
    return res.status(200).send({
      message: "Message sent successfully."
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
export const getAllMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { recieverId } = query;
    const { id } = currentUser;
    const data = await MessageModel.find({
      $or: [
        {
          recieverIds: id,
          senderId: recieverId
        },
        {
          recieverIds: recieverId,
          senderId: id
        }
      ]
    });
    return res.status(200).send({
      message: "Messages fetched successfully.",
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
