import { Request, Response } from "express";
import { ErrorMessage, Email, AvailiableTemplates } from "../common";
import { TrainingModel, UserModel } from "../models";
import { Document } from "mongoose";
import { addNotifications } from ".";
/**
 *
 */
const addNewTraining = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    console.log('====================================');
    console.log(id);
    console.log('====================================');
    const {
      trainingTitle,
      trainingDescription,
      scheduleDate,
      teacherIds
    } = body;
    const data = {
      trainingTitle,
      trainingDescription,
      scheduleDate,
      createdBy: id,
      trainingFor: body.trainingFor || "teacher",
      userIds: teacherIds
    };
    const teachers: Document[] = await UserModel.find({
      _id: {
        $in: teacherIds
      }
    });
    await TrainingModel.create(data);
    const notification = await addNotifications(req, res, `Trining scheduled by super admin.`, `Super Admin has scheduled training for teacher.`, id, [teacherIds], `/teacher/view/${teacherIds}`)
    teachers.forEach(async (teacher: any) => {
      const email = new Email(req);
      await email.setTemplate(AvailiableTemplates.TRAINING_SCHEDULED, {
        teacher_name: teacher.fullName,
        date_time: scheduleDate,
        purpose: trainingTitle,
        description: trainingTitle
      });
      await email.sendEmail(teacher.email);
    });

    return res.status(200).send({
      message: body.trainingFor == "teacher" ? `Training scheduled successfully, and ${
        teachers.length > 1 ? "teachers are" : "teacher is"
      } notified succesfully.` : `Training scheduled successfully, and ${
        teachers.length > 1 ? "Brand ambassadors are" : "Brand ambassador is"
      } notified succesfully.`
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
export { addNewTraining };
