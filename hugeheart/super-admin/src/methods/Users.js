import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, SuccessMessages, ErrorMessage } from "../helpers";
import Validator, { ValidationTypes } from "js-object-validation";
import { Translation } from "../translation";
/**
 *
 */
export const getUsers = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_USERS.service,
    ApiRoutes.GET_USERS.url,
    ApiRoutes.GET_USERS.method,
    ApiRoutes.GET_USERS.authenticate,
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
export const addUpdateMasterAdmin = async (data, id) => {
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
    experienceInBusiness: {
      [ValidationTypes.REQUIRED]: true
    },
    expiryDateChildrenWorking: {
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
    experienceInBusiness: {
      [ValidationTypes.REQUIRED]: "Please enter experience in business."
    },
    expiryDateChildrenWorking: {
      [ValidationTypes.REQUIRED]:
        "Please choose date of experience in business."
    }
  };
  let isValid = true;
  let { isValid: mainIsValid, errors } = Validator(data, validator, messages);
  isValid = mainIsValid;

  const preferValidator = {
    city: {
      [ValidationTypes.REQUIRED]: true
    },
    state: {
      [ValidationTypes.REQUIRED]: true
    },
    country: {
      [ValidationTypes.REQUIRED]: true
    },
    postalCode: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  const preferMessage = {
    city: {
      [ValidationTypes.REQUIRED]: "Please enter city."
    },
    state: {
      [ValidationTypes.REQUIRED]: "Please enter state."
    },
    country: {
      [ValidationTypes.REQUIRED]: "Please enter country."
    },
    postalCode: {
      [ValidationTypes.REQUIRED]: "Please enter postal code."
    }
  };
  const { isValid: preferValid, errors: preferError } = Validator(
    data.preferedLocation,
    preferValidator,
    preferMessage
  );
  if (!preferValid) {
    isValid = preferValid;
  }
  errors = {
    ...errors,
    preferedLocation: preferError
  };
  const exactMessage = {
    streetAddress: {
      [ValidationTypes.REQUIRED]: "Please enter street address."
    },
    addressLine1: {
      [ValidationTypes.REQUIRED]: "Please enter Address line 1."
    },
    city: {
      [ValidationTypes.REQUIRED]: "Please enter city."
    },
    state: {
      [ValidationTypes.REQUIRED]: "Please enter state."
    },
    country: {
      [ValidationTypes.REQUIRED]: "Please enter country."
    },
    postalCode: {
      [ValidationTypes.REQUIRED]: "Please enter postal code."
    }
  };
  const exactValidator = {
    streetAddress: {
      [ValidationTypes.REQUIRED]: true
    },
    addressLine1: {
      [ValidationTypes.REQUIRED]: true
    },
    city: {
      [ValidationTypes.REQUIRED]: true
    },
    state: {
      [ValidationTypes.REQUIRED]: true
    },
    country: {
      [ValidationTypes.REQUIRED]: true
    },
    postalCode: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  const { isValid: exactValid, errors: exactError } = Validator(
    data.exactLocation,
    exactValidator,
    exactMessage
  );
  if (!exactValid) {
    isValid = exactValid;
  }
  errors = {
    ...errors,
    exactLocation: exactError
  };
  if (!isValid) {
    return {
      isSuccess: false,
      errors
    };
  }

  const res = await new ApiHelper().FetchFromServer(
    id
      ? ApiRoutes.UPDATE_MASTER_ADMIN_DETAILS.service
      : ApiRoutes.ADD_MASTER_ADMIN.service,
    id
      ? ApiRoutes.UPDATE_MASTER_ADMIN_DETAILS.url.replace(":id", id)
      : ApiRoutes.ADD_MASTER_ADMIN.url,
    id
      ? ApiRoutes.UPDATE_MASTER_ADMIN_DETAILS.method
      : ApiRoutes.ADD_MASTER_ADMIN.method,
    id
      ? ApiRoutes.UPDATE_MASTER_ADMIN_DETAILS
      : ApiRoutes.ADD_MASTER_ADMIN.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0] || `Master admin details saved successfully.`
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
export const deleteMasterAdmin = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DELETE_MASTER_ADMIN.service,
    ApiRoutes.DELETE_MASTER_ADMIN.url,
    ApiRoutes.DELETE_MASTER_ADMIN.method,
    ApiRoutes.DELETE_MASTER_ADMIN.authenticate,
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
export const updateStatusMasterAdmin = async (id, isActive) => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.UPDATE_STATUS.service,
    ApiRoutes.UPDATE_STATUS.url,
    ApiRoutes.UPDATE_STATUS.method,
    ApiRoutes.UPDATE_STATUS.authenticate,
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
export const getMasterAdminDetails = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_MASTER_ADMIN_DETAILS.service,
    ApiRoutes.GET_MASTER_ADMIN_DETAILS.url.replace(":id", id),
    ApiRoutes.GET_MASTER_ADMIN_DETAILS.method,
    ApiRoutes.GET_MASTER_ADMIN_DETAILS.authenticate
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
