import { ErrorMessage } from "../common";
import { Request, Response } from "express";
import { TeacherMaterialAssignModel } from "../models";
import { addNotifications } from ".";
/**
 *
 */
const assignMaterial = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser, params } = req;
    const { id } = currentUser || {};
    const { teacherId } = body;
    const { id: folderId } = params;
    const result = await TeacherMaterialAssignModel.findOne({
      folderId,
      teacherId
    });
    if (!result) {
      await TeacherMaterialAssignModel.create({
        teacherId,
        folderId,
        createdBy: id
      });
    } else {
      await TeacherMaterialAssignModel.updateOne(
        {
          teacherId,
          folderId
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
    await addNotifications(
      req,
      res,
      `Assign material by super admin.`,
      `Super Admin has assigned material to teacher.`,
      id,
      [teacherId],
      `/teacher/view/${teacherId}`
    );
    return res.status(200).send({
      message: "Material assigned to teacher successfully."
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
const getAssignedMaterials = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const result = await TeacherMaterialAssignModel.find({
      teacherId: id,
      assignmentStatus: "assigned",
      isDeleted: false
    }).populate("folderId");
    return res.status(200).send({
      message: "Assigned materials to teacher fetched successfully.",
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
const removeMaterialFromTeacher = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser, params } = req;
    const { id } = currentUser || {};
    const { teacherId } = body;
    const { id: folderId } = params;
    await TeacherMaterialAssignModel.updateOne(
      {
        teacherId,
        folderId
      },
      {
        $set: {
          assignmentStatus: "unassigned",
          updatedBy: id,
          updatedAt: new Date()
        }
      }
    );
    await addNotifications(
      req,
      res,
      `Unassign material by super admin.`,
      `Super Admin has Unassign material to teacher.`,
      id,
      [teacherId],
      `/teacher/view/${teacherId}`
    );
    return res.status(200).send({
      message: "Material unassigned to teacher successfully."
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
export { assignMaterial, getAssignedMaterials, removeMaterialFromTeacher };
