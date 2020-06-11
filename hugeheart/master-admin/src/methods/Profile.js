import { ApiHelper, logger, ErrorMessage, SuccessMessages } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";
import Validator, { ValidationTypes } from "js-object-validation";
import { Translation } from "../translation";

/**
 * get profile details
 */
export const getProfile = async () => {
  try {
    const res = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_SETTINGS.service,
      ApiRoutes.GET_SETTINGS.url,
      ApiRoutes.GET_SETTINGS.method,
      ApiRoutes.GET_SETTINGS.authenticate
    );
    delete res.data.data.password;
    return res.data.data;
  } catch (error) {
    logger(error);
    return {};
  }
};

/**
 * update user profile details
 */
export const updateProfile = async userData => {
  const validator = {
    email: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.EMAIL]: true
    },
    firstName: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.MAXLENGTH]: 255
    },
    lastName: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.MAXLENGTH]: 255
    }
  };
  const messages = {
    email: {
      [ValidationTypes.REQUIRED]: Translation.REQUIRED_EMAIL_MESSAGE,
      [ValidationTypes.EMAIL]: Translation.VALID_EMAIL_MESSAGE
    },
    firstName: {
      [ValidationTypes.REQUIRED]: Translation.REQUIRED_FIRST_NAME_MESSAGE,
      [ValidationTypes.MAXLENGTH]: Translation.VALID_FIRST_NAME_MESSAGE
    },
    lastName: {
      [ValidationTypes.REQUIRED]: Translation.REQUIRED_LAST_NAME_MESSAGE,
      [ValidationTypes.MAXLENGTH]: Translation.VALID_LAST_NAME_MESSAGE
    }
  };
  const { isValid, errors } = Validator(userData, validator, messages);
  if (!isValid) {
    return {
      isSuccess: false,
      errors
    };
  }
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.UPDATE_SETTINGS.service,
    ApiRoutes.UPDATE_SETTINGS.url,
    ApiRoutes.UPDATE_SETTINGS.method,
    ApiRoutes.UPDATE_SETTINGS.authenticate,
    undefined,
    userData
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
export const updatePassword = async userData => {
  const validator = {
    oldPassword: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.MINLENGTH]: 6,
      [ValidationTypes.MAXLENGTH]: 255
    },
    password: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.MINLENGTH]: 6,
      [ValidationTypes.MAXLENGTH]: 255
    },
    confirmPassword: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.MINLENGTH]: 6,
      [ValidationTypes.MAXLENGTH]: 255,
      [ValidationTypes.EQUAL]: "password"
    }
  };
  const messages = {
    oldPassword: {
      [ValidationTypes.REQUIRED]: "Please enter old password.",
      [ValidationTypes.MINLENGTH]: "Password at least 6 character long.",
      [ValidationTypes.MAXLENGTH]: "Password must be 20 character long"
    },
    password: {
      [ValidationTypes.REQUIRED]: "Please enter new password",
      [ValidationTypes.MINLENGTH]: "Password at least 6 character long.",
      [ValidationTypes.MAXLENGTH]: "Password must be 20 character long"
    },
    confirmPassword: {
      [ValidationTypes.REQUIRED]: "Please enter confirm password",
      [ValidationTypes.MINLENGTH]: "Password at least 6 character long.",
      [ValidationTypes.MAXLENGTH]: "Password must be 20 character long.",
      [ValidationTypes.EQUAL]:
        "Password and confirm password field doesn't match."
    }
  };
  const { isValid, errors } = Validator(userData, validator, messages);
  if (!isValid) {
    return {
      isSuccess: false,
      errors
    };
  }
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.UPDATE_PASSWORD.service,
    ApiRoutes.UPDATE_PASSWORD.url,
    ApiRoutes.UPDATE_PASSWORD.method,
    ApiRoutes.UPDATE_PASSWORD.authenticate,
    undefined,
    userData
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
