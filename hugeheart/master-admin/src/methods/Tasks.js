import { ApiHelper, SuccessMessages, ErrorMessage, logger } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";
import Validator, { ValidationTypes } from "js-object-validation";

/**
 *
 */
export const updateTaskForBA = async (data, id) => {
  const validator = {
    note: {
      [ValidationTypes.REQUIRED]: true,
    },
  };
  const messages = {
    note: {
      [ValidationTypes.REQUIRED]: "Please enter note.",
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
  logger(data);
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.MARK_ASSIGN_TASK_TO_BRAND.service,
    ApiRoutes.MARK_ASSIGN_TASK_TO_BRAND.url.replace(":id", id),
    ApiRoutes.MARK_ASSIGN_TASK_TO_BRAND.method,
    ApiRoutes.MARK_ASSIGN_TASK_TO_BRAND.authenticate,
    undefined,
    { markAs: data.status, markAsNote: data.note }
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
