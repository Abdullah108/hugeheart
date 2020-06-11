import { ApiHelper, SuccessMessages, ErrorMessage } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";
import Validator, { ValidationTypes } from "js-object-validation";

/**
 *
 */
export const getAllCurriculums = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_CURRICULUMS.service,
    ApiRoutes.GET_CURRICULUMS.url,
    ApiRoutes.GET_CURRICULUMS.method,
    ApiRoutes.GET_CURRICULUMS.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: SuccessMessages.DATA_FETCHED_SUCCESS
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
export const deleteCurriculum = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DELETE_CURRICULUM.service,
    ApiRoutes.DELETE_CURRICULUM.url,
    ApiRoutes.DELETE_CURRICULUM.method,
    ApiRoutes.DELETE_CURRICULUM.authenticate,
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

export const addUpdateCurriculum = async (data, id) => {
  const validator = {
    curriculumName: {
      [ValidationTypes.REQUIRED]: true
    },
    country: {
      [ValidationTypes.REQUIRED]: true
    },
    class: {
      [ValidationTypes.REQUIRED]: true
    },
    subject: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  if (!data.file) {
    validator.file = {
      [ValidationTypes.REQUIRED]: true
    };
  }
  const messages = {
    curriculumName: {
      [ValidationTypes.REQUIRED]: "Please enter curriculum name."
    },
    country: {
      [ValidationTypes.REQUIRED]: "Please select country."
    },
    class: {
      [ValidationTypes.REQUIRED]: "Please select class."
    },
    subject: {
      [ValidationTypes.REQUIRED]: "Please selct subject."
    },
    file: {
      [ValidationTypes.REQUIRED]: "Please select file."
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
    id ? ApiRoutes.UPDATE_CURRICULUM.service : ApiRoutes.ADD_CURRICULUM.service,
    id
      ? ApiRoutes.UPDATE_CURRICULUM.url.replace(":id", id)
      : ApiRoutes.ADD_CURRICULUM.url,
    data
  );

  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0] || `Material details saved successfully.`
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE
    };
  }
};
