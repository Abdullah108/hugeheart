import { ErrorMessage, ApiHelper, logger, SuccessMessages } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";
import Validator, { ValidationTypes } from "js-object-validation";
import { Translation } from "../translation";

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
export const addUpdateTeacher = async (data, id) => {
  const validator = {
    email: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.EMAIL]: true
    },
    firstName: {
      [ValidationTypes.REQUIRED]: true
    },
    lastName: {
      [ValidationTypes.REQUIRED]: true
    },
    contactNumber: {
      [ValidationTypes.REQUIRED]: true
    },
    currentAddress: {
      [ValidationTypes.REQUIRED]: true
    },
    emergencyContactNumber: {
      [ValidationTypes.REQUIRED]: true
    },
    emergencyEmail: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  const messages = {
    email: {
      [ValidationTypes.REQUIRED]: Translation.REQUIRED_EMAIL_MESSAGE,
      [ValidationTypes.EMAIL]: Translation.VALID_EMAIL_MESSAGE
    },
    firstName: {
      [ValidationTypes.REQUIRED]: "Please enter first name."
    },
    lastName: {
      [ValidationTypes.REQUIRED]: "Please enter last name."
    },
    contactNumber: {
      [ValidationTypes.REQUIRED]: "Please enter contact number."
    },
    currentAddress: {
      [ValidationTypes.REQUIRED]: "Please enter teacher's current address."
    },
    emergencyContactNumber: {
      [ValidationTypes.REQUIRED]:
        "Please enter teacher's emergency contact number."
    },
    emergencyEmail: {
      [ValidationTypes.REQUIRED]: "Please enter teacher's emergency email."
    }
  };
  let isValid = true;
  let { isValid: mainIsValid, errors } = Validator(data, validator, messages);
  isValid = mainIsValid;

  errors = {
    ...errors
  };
  errors = {
    ...errors
  };
  if (!isValid) {
    return {
      isSuccess: false,
      errors
    };
  }

  const res = await new ApiHelper().postFormData(
    id ? ApiRoutes.UPDATE_TEACHERS.service : ApiRoutes.ADD_TEACHERS.service,
    id
      ? ApiRoutes.UPDATE_TEACHERS.url.replace(":id", id)
      : ApiRoutes.ADD_TEACHERS.url,
    data,
    ["educationDetails", "pastExperience", "availibility", "selectedSubjects"]
  );
  logger(res);
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0] || `Teacher's details saved successfully.`
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
export const deleteTeacher = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DELETE_TEACHER.service,
    ApiRoutes.DELETE_TEACHER.url,
    ApiRoutes.DELETE_TEACHER.method,
    ApiRoutes.DELETE_TEACHER.authenticate,
    undefined,
    { ids: typeof id == "string" ? id.split(",") : id }
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
export const updateStatusTeacher = async (id, isActive) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.UPDATE_TEACHER_STATUS.service,
    ApiRoutes.UPDATE_TEACHER_STATUS.url,
    ApiRoutes.UPDATE_TEACHER_STATUS.method,
    ApiRoutes.UPDATE_TEACHER_STATUS.authenticate,
    undefined,
    { ids: typeof id == "string" ? id.split(",") : id, isActive }
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
export const getAssignedTeachers = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_ASSIGNED_TEACHERS.service,
    ApiRoutes.GET_ASSIGNED_TEACHERS.url.replace(":id", id),
    ApiRoutes.GET_ASSIGNED_TEACHERS.method,
    ApiRoutes.GET_ASSIGNED_TEACHERS.authenticate
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
export const assignNewTeacher = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.ASIGN_NEW_TEACHER.service,
    ApiRoutes.ASIGN_NEW_TEACHER.url,
    ApiRoutes.ASIGN_NEW_TEACHER.method,
    ApiRoutes.ASIGN_NEW_TEACHER.authenticate,
    undefined,
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
export const unassignNewTeacher = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.UNASIGN_NEW_TEACHER.service,
    ApiRoutes.UNASIGN_NEW_TEACHER.url,
    ApiRoutes.UNASIGN_NEW_TEACHER.method,
    ApiRoutes.UNASIGN_NEW_TEACHER.authenticate,
    undefined,
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
export const assignTrainingTeacher = async data => {
  const validator = {
    scheduleDate: {
      [ValidationTypes.REQUIRED]: true
    },
    trainingTitle: {
      [ValidationTypes.REQUIRED]: true
    },
    trainingDescription: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  const messages = {
    scheduleDate: {
      [ValidationTypes.REQUIRED]: "Please choose schedule date and time."
    },
    trainingTitle: {
      [ValidationTypes.REQUIRED]: "Please enter training title."
    },
    trainingDescription: {
      [ValidationTypes.REQUIRED]: "Please enter training description."
    }
  };
  const { isValid, errors } = Validator(data, validator, messages);

  if (!isValid) {
    return {
      isSuccess: false,
      errors
    };
  }
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.ADD_NEW_TRAINING_FOR_TEACHER.service,
    ApiRoutes.ADD_NEW_TRAINING_FOR_TEACHER.url,
    ApiRoutes.ADD_NEW_TRAINING_FOR_TEACHER.method,
    ApiRoutes.ADD_NEW_TRAINING_FOR_TEACHER.authenticate,
    undefined,
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
