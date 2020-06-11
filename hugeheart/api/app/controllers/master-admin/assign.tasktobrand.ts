import { Request, Response } from "express";
import { UserModel, AssignTaskToBrand } from "../../models";
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
import { Types } from "mongoose";
import moment from "moment";
/**
 * ASSIGN TASK TO BRAND
 */
const assignTasktoBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: ValidationFormatter(errors.mapped()),
        success: false,
      });
    }
    const { body, currentUser } = req;
    const { assignTask, additionalNote, assignDate, userId } = body;

    const { id } = currentUser || {};
    const data = {
      assignTask: assignTask,
      additionalNote: additionalNote,
      assignDate: assignDate,
      userId: userId,
    };
    const task = new AssignTaskToBrand(data);
    const result: any = await task.save();
    const getData: any = await AssignTaskToBrand.findOne({
      _id: result._id,
    }).populate("userId");
    console.log("====================================");
    console.log(getData.userId.email);
    console.log("====================================");
    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(AvailiableTemplates.ASIIGNTASK_TO_BRAND_AMB, {
        full_name: getData.userId.fullName,
        assignTask: assignTask,
        assignDate: moment(assignDate).format("LL"),
        additionalNote: additionalNote,
      });
      await emailTemp.sendEmail(getData.userId.email);
      return res.status(200).send({
        message: "Task assign successfully.",
      });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      return res.status(201).send({
        message: "Task assign successfully. But having issue in sending email.",
      });
    }
    return res.status(200).json({
      responseCode: 200,
      message: "Task assign successfully",
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

/**
  |--------------------------------------------------
  | Get Assign Task
  |--------------------------------------------------
  */

const viewAssignTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    console.log("====================================");
    console.log(id);
    console.log("====================================");
    const task = await AssignTaskToBrand.find({
      userId: id,
      isDeleted: false,
    });
    if (!task) {
      return res.status(404).send({
        message: "Task doesn't exits.",
      });
    }
    return res.status(200).send({
      message: "task data fetched successfully.",
      data: task,
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
  |--------------------------------------------------
  | Get Assign Task
  |--------------------------------------------------
  */

const getAssignedTaskForBA = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { currentUser } = req;
    const { id } = currentUser || {};
    console.log("====================================");
    console.log(id);
    console.log("====================================");
    const task = await AssignTaskToBrand.find({
      userId: id,
      isDeleted: false,
    });
    if (!task) {
      return res.status(404).send({
        message: "Task doesn't exits.",
      });
    }
    return res.status(200).send({
      message: "task data fetched successfully.",
      data: task,
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
  |--------------------------------------------------
  | Markas Assign Task
  |--------------------------------------------------
  */

const maerkAssignTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params, body } = req;
    const { id } = params;
    const task = await AssignTaskToBrand.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          markAs: body.markAs,
          markAsNote: body.markAsNote,
        },
      }
    );
    if (task == null) {
      return res.status(404).send({
        message: "Task doesn't exits.",
      });
    }
    const getData: any = await AssignTaskToBrand.findOne({
      _id: id,
    }).populate("userId");
    console.log("====================================");
    console.log(getData.userId.email);
    console.log("====================================");
    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(AvailiableTemplates.MARK_ASSIGN_TASK, {
        full_name: getData.userId.fullName,
        assignTask: getData.assignTask,
        assignDate: getData.assignDate,
        additionalNote: getData.additionalNote,
        markAs: body.markAs == "completed" ? "completed" : "incompleted",
        markAsNote: body.markAsNote,
      });
      await emailTemp.sendEmail(getData.userId.email);
      return res.status(200).send({
        message: "Task updated successfully.",
      });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      return res.status(201).send({
        message: "Task assign successfully. But having issue in sending email.",
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
 *
 */
export {
  assignTasktoBrand,
  viewAssignTask,
  maerkAssignTask,
  getAssignedTaskForBA,
};
