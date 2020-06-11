import { ErrorMessage } from "../common";
import { Request, Response } from "express";
import { UserModel, TeacherScheduleModel } from "../models";

/**
 *
 * @param req
 * @param res
 * @description Add new material
 */
export const getTeacherSchedules = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query } = req;
    const { startDate, endDate } = query;
    const actualStartDate = new Date(
      new Date(startDate).setUTCHours(0, 0, 0, 0)
    );
    const actualEndDate = new Date(
      new Date(endDate).setUTCHours(23, 59, 59, 999)
    );
    let schedule = await UserModel.aggregate([
      {
        $match: {
          userRole: "teacher",
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "teacher_schedules",
          let: {
            teacher: "$_id",
          },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $gte: ["$date", actualStartDate],
                    },
                  },
                  {
                    $expr: {
                      $lte: ["$date", actualEndDate],
                    },
                  },
                  {
                    $expr: {
                      $eq: ["$teacherId", "$$teacher"],
                    },
                  },
                ],
              },
            },
          ],
          as: "event",
        },
      },
    ]);
    schedule = await UserModel.populate(schedule, {
      path: "event.studentId",
      model: "user",
      match: {
        isDeleted: false,
      },
    });
    const newSchedule = schedule.map((sch: any) => {
      const events: any[] = [];
      (sch.event || []).forEach((event: any) => {
        if (event.studentId._id && event.studentId.email) {
          events.push(event);
        }
      });
      return { ...sch, event: events };
    });
    return res.status(200).send({
      message: "Dashboard data feched successfully.",
      data: newSchedule,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
