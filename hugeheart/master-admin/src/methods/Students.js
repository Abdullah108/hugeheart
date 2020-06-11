import { ApiHelper, SuccessMessages, ErrorMessage } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";
import Validator, { ValidationTypes } from "js-object-validation";

/**
 *
 */
export const getStudents = async (data) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_STUDENTS.service,
    ApiRoutes.GET_STUDENTS.url,
    ApiRoutes.GET_STUDENTS.method,
    ApiRoutes.GET_STUDENTS.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: SuccessMessages.PROFILE_UPDATED_SUCCESSFULLY,
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};
/**
 *
 */
export const addStudent = async (data, id) => {
  const validator = {
    email: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.EMAIL]: true,
    },
    firstName: {
      [ValidationTypes.REQUIRED]: true,
    },
    lastName: {
      [ValidationTypes.REQUIRED]: true,
    },
    parentFirstName: {
      [ValidationTypes.REQUIRED]: true,
    },
    parentLastName: {
      [ValidationTypes.REQUIRED]: true,
    },
    parentContactNumber: {
      [ValidationTypes.REQUIRED]: true,
    },
    year: {
      [ValidationTypes.REQUIRED]: true,
    },
    trialClass1: {
      [ValidationTypes.REQUIRED]: true,
    },
    address: {
      [ValidationTypes.REQUIRED]: true,
    },
  };
  const messages = {
    email: {
      [ValidationTypes.REQUIRED]: "Please enter email.",
      [ValidationTypes.EMAIL]: "Please enter valid email.",
    },
    firstName: {
      [ValidationTypes.REQUIRED]: "Please enter student's first name.",
    },
    lastName: {
      [ValidationTypes.REQUIRED]: "Please enter student's last name.",
    },
    parentFirstName: {
      [ValidationTypes.REQUIRED]: "Please enter parent's first name.",
    },
    parentLastName: {
      [ValidationTypes.REQUIRED]: "Please enter parent's last name.",
    },
    parentContactNumber: {
      [ValidationTypes.REQUIRED]: "Please enter parent's contact number.",
    },
    year: {
      [ValidationTypes.REQUIRED]: "Please choose year.",
    },
    trialClass1: {
      [ValidationTypes.REQUIRED]: "Please choose trial class date and time.",
    },
    address: {
      [ValidationTypes.REQUIRED]: "Please enter address.",
    },
  };
  let { isValid, errors } = Validator(data, validator, messages);

  if (!isValid) {
    return {
      isSuccess: false,
      errors,
    };
  }
  const res = await new ApiHelper().FetchFromServer(
    id ? ApiRoutes.UPDATE_STUDENT.service : ApiRoutes.ADD_STUDENT.service,
    id
      ? ApiRoutes.UPDATE_STUDENT.url.replace(":id", id)
      : ApiRoutes.ADD_STUDENT.url,
    id ? ApiRoutes.UPDATE_STUDENT.method : ApiRoutes.ADD_STUDENT.method,
    id
      ? ApiRoutes.UPDATE_STUDENT.authenticate
      : ApiRoutes.ADD_STUDENT.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0],
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};
/**
 *
 */
export const getStudentDetails = async (id) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_STUDENT_DETAILS.service,
    ApiRoutes.GET_STUDENT_DETAILS.url.replace(":id", id),
    ApiRoutes.GET_STUDENT_DETAILS.method,
    ApiRoutes.GET_STUDENT_DETAILS.authenticate
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: SuccessMessages.PROFILE_UPDATED_SUCCESSFULLY,
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};
export const deleteStudent = async (id, fullName) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DELETE_STUDENT.service,
    ApiRoutes.DELETE_STUDENT.url,
    ApiRoutes.DELETE_STUDENT.method,
    ApiRoutes.DELETE_STUDENT.authenticate,
    undefined,
    { ids: typeof id == "string" ? id.split(",") : id }
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0],
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};

/**
 *
 */
export const updateStatusStudent = async (id, isActive) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.UPDATE_STUDENT_STATUS.service,
    ApiRoutes.UPDATE_STUDENT_STATUS.url,
    ApiRoutes.UPDATE_STUDENT_STATUS.method,
    ApiRoutes.UPDATE_STUDENT_STATUS.authenticate,
    undefined,
    { ids: typeof id == "string" ? id.split(",") : id, isActive }
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0],
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};
/**
 *
 */
export const enrollStudent = async (data, id) => {
  const validator = {
    selectedDays: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.NUMERIC]: true,
      [ValidationTypes.MINVALUE]: 1,
    },
    /////*********************** */
    /////*********************** */
    /////*********************** */
    estimateAmount: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.NUMERIC]: true,
      [ValidationTypes.MINVALUE]: 1,
    },
    /////*********************** */
    /////*********************** */
    /////*********************** */

    enrollmentDate: {
      [ValidationTypes.REQUIRED]: true,
    },
    numberofweek: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.NUMERIC]: true,
      [ValidationTypes.MINVALUE]: 1,
    },
    selectedSubjects: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.NUMERIC]: true,
      [ValidationTypes.MINVALUE]: 1,
    },
  };
  const messages = {
    selectedDays: {
      [ValidationTypes.REQUIRED]: "Please choose days.",
      [ValidationTypes.NUMERIC]: "Please choose days.",
      [ValidationTypes.MINVALUE]: "Please choose days.",
    },
    enrollmentDate: {
      [ValidationTypes.REQUIRED]: "Please choose date.",
    },
    numberofweek: {
      [ValidationTypes.REQUIRED]: "Please enter number of weeks.",
      [ValidationTypes.NUMERIC]: "Number of week should be numeric.",
      [ValidationTypes.MINVALUE]: "Number of week should be greater than 0.",
    },
    selectedSubjects: {
      [ValidationTypes.REQUIRED]: "Please choose subjects.",
      [ValidationTypes.NUMERIC]: "Please choose subjects.",
      [ValidationTypes.MINVALUE]: "Please choose subjects.",
    },
  };
  const { isValid, errors } = Validator(data, validator, messages);

  if (!isValid) {
    return {
      isSuccess: false,
      errors,
    };
  }
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.ENROLL_STUDENT.service,
    ApiRoutes.ENROLL_STUDENT.url.replace(":id", id),
    ApiRoutes.ENROLL_STUDENT.method,
    ApiRoutes.ENROLL_STUDENT.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0],
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};
/**
 *
 */
export const sendFeedbackOnSchedule = async (data) => {
  const validator = {
    feedback: {
      [ValidationTypes.REQUIRED]: true,
    },
  };
  const messages = {
    feedback: {
      [ValidationTypes.REQUIRED]: "Please enter feedback.",
    },
  };
  const { isValid, errors } = Validator(data, validator, messages);

  if (!isValid) {
    return {
      isSuccess: false,
      errors,
    };
  }
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.LEAVE_FEEBACK.service,
    ApiRoutes.LEAVE_FEEBACK.url,
    ApiRoutes.LEAVE_FEEBACK.method,
    ApiRoutes.LEAVE_FEEBACK.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0],
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};
/**
 *
 */
export const studentLeaveRequest = async (data) => {
  const validator = {
    mote: {
      [ValidationTypes.REQUIRED]: true,
    },
  };
  const messages = {
    mote: {
      [ValidationTypes.REQUIRED]: "Please enter mote.",
    },
  };
  const { isValid, errors } = Validator(data, validator, messages);

  if (!isValid) {
    return {
      isSuccess: false,
      errors,
    };
  }
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.LEAVE_REQUEST.service,
    ApiRoutes.LEAVE_REQUEST.url,
    ApiRoutes.LEAVE_REQUEST.method,
    ApiRoutes.LEAVE_REQUEST.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0],
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};
//
export const studentSchedule = async (data) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_STUDENT_SCHEDULE.service,
    ApiRoutes.GET_STUDENT_SCHEDULE.url,
    ApiRoutes.GET_STUDENT_SCHEDULE.method,
    ApiRoutes.GET_STUDENT_SCHEDULE.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0],
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE,
    };
  }
};
