import ApiRoutes from "../config/ApiRoutes";
import Validator, { ValidationTypes } from "js-object-validation";
import { ApiHelper, ErrorMessage, logger } from "../helpers";

/**
 *
 */
export const addFolder = async (data, id) => {
  const validator = {
    folderName: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  const messages = {
    folderName: {
      [ValidationTypes.REQUIRED]: "Please enter folder name."
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

  const res = await new ApiHelper().FetchFromServer(
    id ? ApiRoutes.UPDATE_FOLDER.service : ApiRoutes.ADD_FOLDER.service,
    id
      ? ApiRoutes.UPDATE_FOLDER.url.replace(":id", id)
      : ApiRoutes.ADD_FOLDER.url,
    id ? ApiRoutes.UPDATE_FOLDER.method : ApiRoutes.ADD_FOLDER.method,
    id
      ? ApiRoutes.UPDATE_FOLDER.authenticate
      : ApiRoutes.ADD_FOLDER.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0] || `Folder created successfully.`
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
export const addFolderByZip = async data => {
  logger(data);
  const validator = {
    folderName: {
      [ValidationTypes.REQUIRED]: true
    },
    class: {
      [ValidationTypes.REQUIRED]: true
    },
    subject: {
      [ValidationTypes.REQUIRED]: true
    },
    fileName: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  const messages = {
    folderName: {
      [ValidationTypes.REQUIRED]: "Please enter folder name."
    },
    class: {
      [ValidationTypes.REQUIRED]: "Please choose year."
    },
    subject: {
      [ValidationTypes.REQUIRED]: "Please choose subject."
    },
    fileName: {
      [ValidationTypes.REQUIRED]: "Please choose zip file."
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
    ApiRoutes.ADD_FOLDER_BY_ZIP.service,
    ApiRoutes.ADD_FOLDER_BY_ZIP.url,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0] || `Folder created successfully.`
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
export const addCurriculumFolderByZip = async data => {
  logger(data);
  const validator = {
    folderName: {
      [ValidationTypes.REQUIRED]: true
    },
    country: {
      [ValidationTypes.REQUIRED]: true
    },
    fileName: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  const messages = {
    folderName: {
      [ValidationTypes.REQUIRED]: "Please enter folder name."
    },
    country: {
      [ValidationTypes.REQUIRED]: "Please choose country."
    },
    fileName: {
      [ValidationTypes.REQUIRED]: "Please choose zip file."
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
    ApiRoutes.ADD_CURRICULUM_FOLDER_BY_ZIP.service,
    ApiRoutes.ADD_CURRICULUM_FOLDER_BY_ZIP.url,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: res.messages[0] || `Folder created successfully.`
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
export const getAllFolders = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_FOLDER.service,
    ApiRoutes.GET_FOLDER.url,
    ApiRoutes.GET_FOLDER.method,
    ApiRoutes.GET_FOLDER.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: "Folder list fetched successfully."
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
export const deleteFolder = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DELETE_FOLDER.service,
    ApiRoutes.DELETE_FOLDER.url,
    ApiRoutes.DELETE_FOLDER.method,
    ApiRoutes.DELETE_FOLDER.authenticate,
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
