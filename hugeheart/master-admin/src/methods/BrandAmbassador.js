import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, SuccessMessages, ErrorMessage, logger } from "../helpers";
import Validator, { ValidationTypes } from "js-object-validation";
import { Translation } from "../translation";
/**
 *
 */
export const getBrands = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_BRAND_AMBASSADOR.service,
    ApiRoutes.GET_BRAND_AMBASSADOR.url,
    ApiRoutes.GET_BRAND_AMBASSADOR.method,
    ApiRoutes.GET_BRAND_AMBASSADOR.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      //message: SuccessMessages.PROFILE_UPDATED_SUCCESSFULLY
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
export const addBrand = async (data, id) => {
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
    title: {
      [ValidationTypes.REQUIRED]: true
    },
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
    title: {
      [ValidationTypes.REQUIRED]: "Please enter title."
    },
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

  const res = await new ApiHelper().FetchFromServer(
    id
      ? ApiRoutes.UPDATE_BRAND_AMBASSADOR.service
      : ApiRoutes.ADD_BRAND_AMBASSADOR.service,
    id
      ? ApiRoutes.UPDATE_BRAND_AMBASSADOR.url.replace(":id", id)
      : ApiRoutes.ADD_BRAND_AMBASSADOR.url,
    id
      ? ApiRoutes.UPDATE_BRAND_AMBASSADOR.method
      : ApiRoutes.ADD_BRAND_AMBASSADOR.method,
    id
      ? ApiRoutes.UPDATE_BRAND_AMBASSADOR.authenticate
      : ApiRoutes.ADD_BRAND_AMBASSADOR.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: SuccessMessages.BRAND_ADD_SUCCESSFULLY
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
export const deleteBrand = async (id, fullName) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DELETE_BRAND_AMBASSADOR.service,
    ApiRoutes.DELETE_BRAND_AMBASSADOR.url,
    ApiRoutes.DELETE_BRAND_AMBASSADOR.method,
    ApiRoutes.DELETE_BRAND_AMBASSADOR.authenticate,
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
export const updateStatusBrand = async (id, isActive) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.UPDATE_BRAND_AMBASSADOR_STATUS.service,
    ApiRoutes.UPDATE_BRAND_AMBASSADOR_STATUS.url,
    ApiRoutes.UPDATE_BRAND_AMBASSADOR_STATUS.method,
    ApiRoutes.UPDATE_BRAND_AMBASSADOR_STATUS.authenticate,
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
export const getBrandDetails = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.VIEW_BRAND_AMBASSADOR.service,
    ApiRoutes.VIEW_BRAND_AMBASSADOR.url.replace(":id", id),
    ApiRoutes.VIEW_BRAND_AMBASSADOR.method,
    ApiRoutes.VIEW_BRAND_AMBASSADOR.authenticate
  );
  console.log('====================================');
  console.log("res", res);
  console.log('====================================');
  logger(res)
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
/**
 *
 */
export const assignTrainingBrand = async data => {
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
    ApiRoutes.ADD_NEW_TRAINING_FOR_BRAND_AMB.service,
    ApiRoutes.ADD_NEW_TRAINING_FOR_BRAND_AMB.url,
    ApiRoutes.ADD_NEW_TRAINING_FOR_BRAND_AMB.method,
    ApiRoutes.ADD_NEW_TRAINING_FOR_BRAND_AMB.authenticate,
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