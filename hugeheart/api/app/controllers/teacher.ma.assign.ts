import { Request, Response } from "express";
import { ErrorMessage } from "../common";
import { AssignmentModel } from "../models";

/**
 *
 */
const assignTeacher = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { teacherId, masterAdminId } = body;
    const result = await AssignmentModel.findOne({
      masterAdminId,
      teacherId
    });
    if (!result) {
      await AssignmentModel.create({
        teacherId,
        masterAdminId,
        createdBy: id
      });
    } else {
      await AssignmentModel.updateOne(
        {
          teacherId,
          masterAdminId
        },
        {
          $set: {
            assignmentStatus: "assigned",
            updatedBy: id,
            updatedAt: new Date()
          }
        }
      );
    }
    return res.status(200).send({
      message: "Teacher assigned to master admin successfully."
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
const getAssignedTeachers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const result = await AssignmentModel.find({
      masterAdminId: id,
      assignmentStatus: "assigned"
    }).populate("teacherId");
    return res.status(200).send({
      message: "Assigned Teacher to master admin fetched successfully.",
      data: result
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
const removeTeacherFromMA = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { teacherId, masterAdminId } = body;
    await AssignmentModel.updateOne(
      {
        teacherId,
        masterAdminId
      },
      {
        $set: {
          assignmentStatus: "unassigned",
          updatedBy: id,
          updatedAt: new Date()
        }
      }
    );
    return res.status(200).send({
      message: "Teacher unassigned to master admin successfully."
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
export { assignTeacher, getAssignedTeachers, removeTeacherFromMA };
