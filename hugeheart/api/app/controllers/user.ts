import { Request, Response } from "express";
import { ErrorMessage } from "../common";
import { UserModel } from "../models";
import { Types } from "mongoose";
/**
 *
 */
const getAdminProfileDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { currentUser } = req;
    const { id } = currentUser || {};
    const data: Document | null | any = await UserModel.findOne({
      isDeleted: false,
      _id: Types.ObjectId(id),
      userRole: "superadmin"
    });
    return res.status(200).send({
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
/**
 * For updating Admin profile
 */
const updateAdminProfile = async (
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
        _id: Types.ObjectId(id)
      },
      {
        firstName,
        lastName,
        fullName,
        email
      }
    );
    return res.status(200).send({
      message: "User details updated successfully."
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
const getAdminIds = async (): Promise<string[]> => {
  try {
    const data: Document[] | any[] = await UserModel.find({
      isDeleted: false,
      userRole: "superadmin"
    });
    return data.map(d => d._id.toString());
  } catch (error) {
    return [];
  }
};
/**
 *
 */
const getSuperAdmins = async (req: Request, res: Response): Promise<any> => {
  try {
    const data: Document[] | any[] = await UserModel.find({
      isDeleted: false,
      userRole: "superadmin"
    });
    return res.status(200).send({
      message: "User details updated successfully.",
      data
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
export {
  getAdminProfileDetails,
  updateAdminProfile,
  getAdminIds,
  getSuperAdmins
};
