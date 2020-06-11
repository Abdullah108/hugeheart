import { ErrorMessage, ApiHelper, SuccessMessages } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";

/**
 * Teacher
 */
export const getAllTeachers = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_TEACHERS.service,
    ApiRoutes.GET_TEACHERS.url,
    ApiRoutes.GET_TEACHERS.method,
    ApiRoutes.GET_TEACHERS.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: SuccessMessages.PROFILE_UPDATED_SUCCESSFULLY
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE
    };
  }
};

/**
 *
 */
export const getTeacherDetails = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_TEACHER_DETAILS.service,
    ApiRoutes.GET_TEACHER_DETAILS.url.replace(":id", id),
    ApiRoutes.GET_TEACHER_DETAILS.method,
    ApiRoutes.GET_TEACHER_DETAILS.authenticate
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0]
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE
    };
  }
};

/**
 *
 */
export const teacherSchedule = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.TEACHER_SCHEDULE.service,
    ApiRoutes.TEACHER_SCHEDULE.url,
    ApiRoutes.TEACHER_SCHEDULE.method,
    ApiRoutes.TEACHER_SCHEDULE.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0]
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE
    };
  }
};

/**
 *
 */
export const getTeacherSchedule = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_TEACHER_SCHEDULE.service,
    ApiRoutes.GET_TEACHER_SCHEDULE.url,
    ApiRoutes.GET_TEACHER_SCHEDULE.method,
    ApiRoutes.GET_TEACHER_SCHEDULE.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0]
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE
    };
  }
};