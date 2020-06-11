import { Request, Response } from "express";
import {
  ErrorMessage,
  Email,
  AvailiableTemplates,
  generatePassword,
  encryptPassword,
} from "../common";
import { UserModel, TeacherScheduleModel } from "../models";
import { addNotifications } from "./notification";
import { getAdminIds } from "./user";
import { AppAdminURL, AppFrontendURL } from "../config";
import { Types } from "mongoose";
import moment = require("moment");
//import * as moment from "moment";

const getDays = (days: string[]) => {
  const dayObj: any = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };
  return (days || []).map((day: any) => {
    return dayObj[day.toLowerCase()] || false;
  });
};
const getDayNumberByName = (day: string) => {
  const dayObj: any = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };
  return dayObj[day.toLowerCase()];
};
/**
 *
 */
export const getStudents = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { skip, limit, search, status } = query;
    let condition: any = {
      isDeleted: false,
      userRole: "student",
    };
    if (
      currentUser.userRole != "superadmin" &&
      currentUser.userRole != "teacher"
    ) {
      condition["$or"] = [
        {
          createdBy: Types.ObjectId(currentUser.id),
        },
        {
          masterAdminId: Types.ObjectId(currentUser.id),
        },
      ];
    } else if (currentUser.userRole == "teacher") {
      condition.assignedTeacher = Types.ObjectId(currentUser.id);
    }
    if (search) {
      condition["$or"] = [
        {
          email: {
            $regex: new RegExp(search, "i"),
          },
        },
        {
          fullName: {
            $regex: new RegExp(search, "i"),
          },
        },
      ];
    }
    if (status) {
      condition.enrollmentStatus =
        status == "enrolled" ? "enrolled" : "not enrolled";
    }
    const data = await UserModel.find(condition)
      .populate("masterAdminId assignedTeacher")
      .skip(Number(skip || 0))
      .limit(Number(limit || 10))
      .sort({ createdAt: -1 });

    const totalUsers = await UserModel.countDocuments(condition);
    return res.status(200).send({
      message: "Students data fetched successfully.",
      data,
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
 *
 */
export const addStudent = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const {
      address,
      email,
      firstName,
      lastName,
      contactNumber,
      parentFirstName,
      parentLastName,
      selectedSubjects,
      trialClass1,
      trialClass2,
      trialClass3,
      studyProblems,
      year,
      teacherId,
    } = body;
    const user = await UserModel.findOne({
      email,
      isDeleted: false,
    });

    if (user) {
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id.",
      });
    }

    const trialClass = [];
    if (trialClass1) {
      trialClass.push(trialClass1);
    }
    if (trialClass2) {
      trialClass.push(trialClass2);
    }
    if (trialClass3) {
      trialClass.push(trialClass3);
    }
    const plainPwd = generatePassword(6);
    console.log(plainPwd);
    const password = encryptPassword(plainPwd);
    const data: any = {
      address,
      email,
      firstName,
      lastName,
      parentFirstName,
      parentLastName,
      year,
      contactNumber,
      selectedSubjects,
      studyProblems,
      trialClass,
      userRole: "student",
      fullName: `${firstName} ${lastName}`,
      masterAdminId:
        currentUser.userRole === "superadmin"
          ? body.masterAdminId
          : currentUser.userRole === "masteradmin"
          ? currentUser.id
          : currentUser.createdBy,
      createdBy: currentUser.id,
      password,
      assignedTeacher: teacherId,
    };

    const resp = await UserModel.create(data);
    if (currentUser.userRole === "superadmin" && teacherId) {
      await TeacherScheduleModel.create({
        teacherId,
        studentId: resp._id,
        date: trialClass[0],
        startDateTime: trialClass[0],
        endtDateTime: trialClass[0],
      });
    }
    await addNotifications(
      req,
      res,
      `New Student Added`,
      `${
        currentUser.fullName ||
        [currentUser.firstName, currentUser.lastName].join(" ")
      } has added ${data.fullName} as a student.`,
      currentUser.id,
      await getAdminIds(),
      `${AppAdminURL}/students/view/${resp._id}`
    );

    try {
      const emailTemp = new Email(req);
      await emailTemp.setTemplate(AvailiableTemplates.STUDENT_REFISTRATION, {
        full_name: data.fullName,
        email: email,
        password: plainPwd,
        link: AppFrontendURL,
      });
      await emailTemp.sendEmail(email);
      return res.status(200).send({
        message: "Student details added successfully.",
      });
    } catch (error) {
      return res.status(201).send({
        message:
          "Student details added successfully. But having issue in sending email.",
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
export const getStudentDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params, currentUser } = req;
    const { id } = params;
    let condition: any = {
      isDeleted: false,
      userRole: "student",
      _id: id,
    };
    if (
      currentUser.userRole !== "superadmin" &&
      currentUser.userRole !== "teacher"
    ) {
      condition["$or"] = [
        {
          createdBy: currentUser.id,
        },
        {
          masterAdminId: currentUser.id,
        },
      ];
    }
    const users = await UserModel.findOne(condition).populate(
      "masterAdminId",
      "fullName"
    );
    return res.status(200).send({
      message: "Student details fetched successfully.",
      data: users,
    });
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
export const updateStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser, params } = req;
    const { id } = params;
    const {
      address,
      email,
      firstName,
      lastName,
      contactNumber,
      parentFirstName,
      parentLastName,
      selectedSubjects,
      trialClass1,
      trialClass2,
      trialClass3,
      studyProblems,
      year,
    } = body;
    const user = await UserModel.findOne({
      email,
      isDeleted: false,
      _id: {
        $ne: id,
      },
    });

    if (user) {
      return res.status(400).send({
        message:
          "This email id is already regitered. Please try with another id.",
      });
    }

    const trialClass = [];
    if (trialClass1) {
      trialClass.push(trialClass1);
    }
    if (trialClass2) {
      trialClass.push(trialClass2);
    }
    if (trialClass3) {
      trialClass.push(trialClass3);
    }
    const data: any = {
      address,
      email,
      firstName,
      lastName,
      parentFirstName,
      parentLastName,
      year,
      contactNumber,
      selectedSubjects,
      studyProblems,
      trialClass,
      fullName: `${firstName} ${lastName}`,
      updateBy: currentUser.id,
    };
    if (currentUser.userRole === "superadmin") {
      data["masterAdminId"] = body.masterAdminId;
    }
    const resp: any = await UserModel.findOne({
      _id: id,
      userRole: "student",
    });
    if (
      currentUser.userRole === "superadmin" &&
      resp &&
      resp.enrollmentStatus !== "enrolled"
    ) {
      await TeacherScheduleModel.updateMany(
        {
          studentId: id,
        },
        {
          date: trialClass[0],
          startDateTime: trialClass[0],
          endDateTime: trialClass[0],
        }
      );
    }
    await addNotifications(
      req,
      res,
      `Student Details Updated`,
      `${currentUser.fullName} has updated details of a student (${data.fullName}).`,
      currentUser.id,
      await getAdminIds(),
      `${AppAdminURL}/students/view/${id}`
    );
    if (resp.email !== email) {
      try {
        const plainPwd = generatePassword(6);
        const password = encryptPassword(plainPwd);
        data["password"] = password;
        const emailTemp = new Email(req);
        await emailTemp.setTemplate(AvailiableTemplates.STUDENT_REFISTRATION, {
          full_name: data.fullName,
          email: email,
          password: plainPwd,
          link: AppFrontendURL,
        });
        await emailTemp.sendEmail(email);
      } catch (error) {}
    }
    await UserModel.updateOne(
      {
        _id: id,
      },
      data
    );
    return res.status(200).send({
      message: "Student details updated successfully.",
    });
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
export const assignTeacherToStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    let { teacherId, studentId, dateTime, newDate } = body;
    const studentDetails: any = await UserModel.findOne({
      _id: studentId,
      userRole: "student",
    });
    if (!studentDetails) {
      return res.status(400).send({
        message: `This student is not available in records.`,
      });
    }
    await UserModel.updateOne(
      {
        _id: studentId,
      },
      {
        $set: {
          assignedTeacher: teacherId,
        },
      }
    );
    const { enrollmentStatus } = studentDetails;
    if (enrollmentStatus == "enrolled") {
      let cond: any = {
        studentId,
        date: {
          $gte: new Date(new Date(newDate)),
        },
      };

      await TeacherScheduleModel.updateMany(cond, {
        teacherId,
      });
    } else {
      await TeacherScheduleModel.deleteMany({ studentId });
      const dataToInsert = [
        {
          teacherId,
          studentId,
          date: dateTime,
          startDateTime: dateTime,
          endtDateTime: dateTime,
        },
      ];
      await TeacherScheduleModel.create(dataToInsert);
    }
    try {
      await addNotifications(
        req,
        res,
        `New Student Assigned`,
        `Superadmin has assigned a student to you.`,
        currentUser.id,
        teacherId,
        `${AppFrontendURL}/students/view/${studentId}`
      );
    } catch (error) {}
    // const emailTemp = new Email(req);
    // await emailTemp.setTemplate(AvailiableTemplates.STUDENT_REFISTRATION, {
    //   full_name: data.fullName,
    //   email: email
    // });
    // await emailTemp.sendEmail(email);
    return res.status(200).send({
      message: "Teacher assigned to student successfully.",
    });
  } catch (error) {
    console.log("get schedule", error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 *
 */
export const enrollStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { id } = params;
    const {
      days,
      numberofweek,
      enrollmentDate,
      subjects,
      estimateAmount,
    } = body;
    const trialClassDetails: any = await TeacherScheduleModel.findOne({
      studentId: id,
      isDeleted: false,
    });
    if (!trialClassDetails) {
      return res.status(400).send({
        message:
          "Teacher is not assigned to this student. Please wait until Super Admin assign a teacher to this student.",
      });
    }
    await UserModel.updateOne(
      {
        _id: id,
      },
      {
        enrollmentStatus: "enrolled",
        enrollmentDate: new Date(enrollmentDate),
        subjects,
        days,
      }
    );
    const teacherScheduleData: any[] = [];
    const { teacherId } = trialClassDetails;
    for (let i = 0; i < parseInt(numberofweek); i++) {
      days.map((dat: any) => {
        const time = dat.time.split(":");
        const timeHH = time[0];
        const timeMM = time[1];
        const dayInNumber = getDayNumberByName(dat.day);
        const weekDay = moment(enrollmentDate).isoWeekday();
        let d = "";
        if (i == 0 && weekDay > dayInNumber) {
          d = moment(enrollmentDate)
            .add(numberofweek, "weeks")
            .day(dayInNumber)
            .format("YYYY-MM-DD");
        } else {
          d = moment(enrollmentDate)
            .add(i, "weeks")
            .day(dayInNumber)
            .format("YYYY-MM-DD");
        }
        const date = moment(moment(d).format("YYYY-MM-DD 00:00:000"))
          .utc()
          .set({ hours: timeHH, minutes: timeMM })
          .format();
        console.log(date, new Date(`${date}`));

        teacherScheduleData.push({
          studentId: id,
          teacherId,
          date,
          startDateTime: date,
          endDateTime: moment(date).utc().add(dat.hours, "hours").format(),
          isTrialClass: false,
        });
      });
    }

    await TeacherScheduleModel.create(teacherScheduleData);
    return res.status(200).send({
      message: "Student enrolled successfully.",
      teacherScheduleData,
    });
  } catch (error) {
    console.log("get schedule", error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 *
 */
export const leaveFeedback = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id, userRole } = currentUser || {};
    const { scheduleId, feedback } = body;
    const data = await TeacherScheduleModel.update(
      {
        _id: scheduleId,
      },
      {
        $push: {
          feedbacks: {
            text: feedback,
            createdBy: id,
            userRole,
          },
        },
      }
    );
    return res.status(200).send({
      message: "Feeback sent successfully.",
      success: true,
      data,
      scheduleId,
      feedback,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/* ------- Request Leave ------- */
export const leaveRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, params } = req;
    const { id } = params;
    const { note, date, leaveStatus } = body;
    const data = {
      note,
      date,
      leaveStatus,
    };
    const result = TeacherScheduleModel.update(
      {
        _id: id,
      },
      {
        $set: {
          leaveStatus: "requested",
          note: note,
        },
      }
    );
    return res.status(200).json({
      message: "Student leave request.",
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
 *
 */
export const getStudentSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { id: studentId, userRole } = currentUser;
    const { startDate, endDate } = query;
    const data: any = await TeacherScheduleModel.find({
      studentId: userRole == "student" ? studentId : query.studentId,
      $and: [
        {
          date: {
            $gte: new Date(new Date(startDate).setUTCHours(0, 0, 0)),
          },
        },
        {
          date: {
            $lte: new Date(new Date(endDate).setUTCHours(11, 59, 999)),
          },
        },
      ],
    }).populate("teacherId", "fullName");
    return res.status(200).send({
      message: "Students Schedule fetched successfully.",
      success: true,
      data,
    });
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
export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids } = body;
    await UserModel.deleteMany({
      _id: {
        $in: ids,
      },
      userRole: "student",
    });
    return res.status(200).send({
      message: "Student deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
