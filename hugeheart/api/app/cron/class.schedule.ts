import { TeacherScheduleModel } from "../models";
import moment from "moment";
import { Email, AvailiableTemplates } from "../common";
import { AppFrontendURL } from "../config";
/**
 * Update Class Schedule
 */
export const checkAndUpdateClassSchedule = async () => {
  try {
    const endTime = new Date(
      moment()
        .utc()
        .set("hour", 23)
        .set("minutes", 59)
        .set("seconds", 59)
        .set("milliseconds", 999)
        .format()
    );
    const updatedRecords = await TeacherScheduleModel.updateMany(
      {
        endDateTime: {
          $lte: endTime
        }
      },
      {
        isCompleted: true
      }
    );
    console.log(
      "%d records updated for class schedule!",
      updatedRecords.nModified
    );
  } catch (error) {
    console.log(error.message);
  }
};
/**
 * Send email to classes starting in 15 mins
 */
export const sendReminder = async (minutes: number) => {
  try {
    const startTime = new Date(
      moment()
        .utc()
        .set("seconds", 0)
        .set("milliseconds", 0)
        .format()
    );
    const endTime = new Date(
      moment()
        .utc()
        .add(minutes, "minutes")
        .set("seconds", 59)
        .set("milliseconds", 999)
        .format()
    );
    const schedules = await TeacherScheduleModel.find({
      startDateTime: {
        $gte: startTime,
        $lte: endTime
      }
    }).populate("teacherId studentId");
    schedules.forEach(async (schedule: any) => {
      // send email to student
      try {
        const emailTemp = new Email();
        await emailTemp.setTemplate(AvailiableTemplates.CLASS_REMINDER, {
          full_name: schedule.studentId.fullName,
          other_person: schedule.teacherId.email,
          remaining_minutes: minutes,
          class_time: schedule.startDateTime,
          link: AppFrontendURL
        });
        await emailTemp.sendEmail(schedule.studentId.email);
      } catch (error) {
        console.log(
          `Error in sending email to %s student for %s class!`,
          schedule.studentId.fullName,
          schedule.startDateTime
        );
      }
      // send email to teacher
      try {
        const emailTemp = new Email();
        await emailTemp.setTemplate(AvailiableTemplates.CLASS_REMINDER, {
          full_name: schedule.teacherId.fullName,
          other_person: schedule.studentId.email,
          remaining_minutes: minutes,
          class_time: schedule.startDateTime,
          link: AppFrontendURL
        });
        await emailTemp.sendEmail(schedule.teacherId.email);
      } catch (error) {
        console.log(
          `Error in sending email to %s teacher for %s class!`,
          schedule.teacherId.fullName,
          schedule.startDateTime
        );
      }
    });
  } catch (error) {
    console.log(
      `Error in sending email to %s teacher for %s class!`,
      error.message
    );
    console.log(error.message);
  }
};
