import { Request, Response } from "express";
import { Types } from "mongoose";
import { AssignmentModel } from "../../models";
import { ErrorMessage } from "../../common";

/**
 * GET Teacher
 */
const getAllMasterAdmins = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { skip, limit } = query;
    let condition: any = {
      assignmentStatus: "assigned",
      teacherId: currentUser ? Types.ObjectId(currentUser.id) : null
    };

    const users: any = await AssignmentModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "masterAdminId",
          foreignField: "_id",
          as: "masterAdminId"
        }
      },
      {
        $match: condition
      }
    ])
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 25)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      message: "Master admin fetched successfully.",
      data: users[0] ? users[0].masterAdminId : []
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
export { getAllMasterAdmins };
