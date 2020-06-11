import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, SuccessMessages, ErrorMessage, logger } from "../helpers";
import Validator, { ValidationTypes } from "js-object-validation";
/**
 *
 */
export const assignTaskToBrand = async (data, id) => {
  const validator = {
    assignTask: {
      [ValidationTypes.REQUIRED]: true,
    },
  };
  const messages = {
    assignTask: {
      [ValidationTypes.REQUIRED]: "Please enter task.",
    },
  };
  let isValid = true;
  let { isValid: mainIsValid, errors } = Validator(data, validator, messages);
  isValid = mainIsValid;

  if (!isValid) {
    return {
      isSuccess: false,
      errors,
    };
  }

  const res = await new ApiHelper().FetchFromServer(
    id
      ? ApiRoutes.MARK_ASSIGN_TASK_TO_BRAND.service
      : ApiRoutes.ASSIGN_TASK_TO_BRAND.service,
    id
      ? ApiRoutes.MARK_ASSIGN_TASK_TO_BRAND.url.replace(":id", id)
      : ApiRoutes.ASSIGN_TASK_TO_BRAND.url,
    id
      ? ApiRoutes.MARK_ASSIGN_TASK_TO_BRAND.method
      : ApiRoutes.ASSIGN_TASK_TO_BRAND.method,
    id
      ? ApiRoutes.MARK_ASSIGN_TASK_TO_BRAND.authenticate
      : ApiRoutes.ASSIGN_TASK_TO_BRAND.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: SuccessMessages.ASSIGN_TASK_SUCCESSFULLY,
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
export const getAssignDetails = async (id) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.VIEW_ASSIGN_TASK_TO_BRAND.service,
    ApiRoutes.VIEW_ASSIGN_TASK_TO_BRAND.url.replace(":id", id),
    ApiRoutes.VIEW_ASSIGN_TASK_TO_BRAND.method,
    ApiRoutes.VIEW_ASSIGN_TASK_TO_BRAND.authenticate
  );
  console.log("====================================");
  console.log("res", res);
  console.log("====================================");
  logger(res);
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
