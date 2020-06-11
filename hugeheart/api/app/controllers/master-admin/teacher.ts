import { Request, Response } from "express";
import { UserModel, AssignmentModel } from "../../models";
import { ErrorMessage } from "../../common";
import { Types } from "mongoose";

/**
 * GET Teacher
 */
const getAllTeachers = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { skip, limit, search, statusActive } = query;
    let condition: any = {
      assignmentStatus: "assigned",
      masterAdminId: currentUser ? Types.ObjectId(currentUser.id) : null,
      "teacherId.isDeleted": false,
    };
    if (search) {
      condition["$or"] = [
        {
          "teacherId.email": {
            $regex: new RegExp(search, "i"),
          },
        },
        {
          "teacherId.fullName": {
            $regex: new RegExp(search, "i"),
          },
        },
      ];
    }
    if (statusActive) {
      condition.isActive = statusActive == "true" ? "true" : "false";
    }
    const users: any = await AssignmentModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacherId",
        },
      },
      {
        $unwind: "$teacherId",
      },
      {
        $match: condition,
      },
    ])
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 25)
      .sort({ createdAt: -1 });
    const totalUsers = await AssignmentModel.countDocuments(condition);
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
 * View teacher details
 */
const viewTeacher = async (req: Request, res: Response): Promise<any> => {
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

export { getAllTeachers, viewTeacher };
