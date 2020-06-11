import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, SuccessMessages, ErrorMessage } from "../helpers";
import Validator, { ValidationTypes } from "js-object-validation";

/**
 *
 */
export const getPrinciple = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_PRINCIPLE.service,
    ApiRoutes.GET_PRINCIPLE.url,
    ApiRoutes.GET_PRINCIPLE.method,
    ApiRoutes.GET_PRINCIPLE.authenticate,
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
export const addUpdatePrinciple = async (data, id) => {
  const validator = {
    answer: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  const messages = {
    answer: {
      [ValidationTypes.REQUIRED]: "Please enter this field."
    }
  };
  let isValid = true;
  let { isValid: mainIsValid, errors } = Validator(data, validator, messages);
  isValid = mainIsValid;
  if (!isValid) {
    return {
      isSuccess: false,
      errors
    };
  }

  const res = await new ApiHelper().postFormData(
    id
      ? ApiRoutes.UPDATE_PRINCIPLE_DETAILS.service
      : ApiRoutes.ADD_PRINCIPLE.service,
    id
      ? ApiRoutes.UPDATE_PRINCIPLE_DETAILS.url.replace(":id", id)
      : ApiRoutes.ADD_PRINCIPLE.url,
    data,
    []
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0] || `Principle details saved successfully.`
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
export const getPrincipleDetails = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_PRINCIPLE_DETAILS.service,
    ApiRoutes.GET_PRINCIPLE_DETAILS.url.replace(":id", id),
    ApiRoutes.GET_PRINCIPLE_DETAILS.method,
    ApiRoutes.GET_PRINCIPLE_DETAILS.authenticate
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
export const deletePrinciple = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DELETE_PRINCIPLE.service,
    ApiRoutes.DELETE_PRINCIPLE.url,
    ApiRoutes.DELETE_PRINCIPLE.method,
    ApiRoutes.DELETE_PRINCIPLE.authenticate,
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
