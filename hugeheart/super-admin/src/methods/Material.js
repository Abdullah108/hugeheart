import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, ErrorMessage, logger, SuccessMessages } from "../helpers";
import Validator, { ValidationTypes } from "js-object-validation";

export const addUpdateMaterial = async (data, id) => {
  
  const validator = {
    topic: {
      [ValidationTypes.REQUIRED]: true
    },
    subTopic: {
      [ValidationTypes.REQUIRED]: true
    },
    _class: {
      [ValidationTypes.REQUIRED]: true
    },
    subject: {
      [ValidationTypes.REQUIRED]: true
    }
  };
  if (!data.file && !id) {
    validator.file = {
      [ValidationTypes.REQUIRED]: true
    };
  }
  const messages = {
    topic: {
      [ValidationTypes.REQUIRED]: "Please select Topic"
    },
    subTopic: {
      [ValidationTypes.REQUIRED]: "Please select sub Topic"
    },
    _class: {
      [ValidationTypes.REQUIRED]: "Please select class"
    },
    subject: {
      [ValidationTypes.REQUIRED]: "Please selct subject"
    },
    file: {
      [ValidationTypes.REQUIRED]: "Please select file"
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
    id ? ApiRoutes.UPDATE_MATERIAL.service : ApiRoutes.ADD_MATERIAL.service,
    id
      ? ApiRoutes.UPDATE_MATERIAL.url.replace(":id", id)
      : ApiRoutes.ADD_MATERIAL.url,
    data
  );
  logger(res);
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
/**
 *
 */
export const getAllMaterials = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_MATERIALS.service,
    ApiRoutes.GET_MATERIALS.url,
    ApiRoutes.GET_MATERIALS.method,
    ApiRoutes.GET_MATERIALS.authenticate,
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
export const assignMaterialToTeacher = async (id, data) => {
  logger(id, data);
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.ASSIGN_MATERIAL_TO_TEACHER.service,
    ApiRoutes.ASSIGN_MATERIAL_TO_TEACHER.url.replace(":id", id),
    data.assign ? ApiRoutes.ASSIGN_MATERIAL_TO_TEACHER.method : "delete",
    ApiRoutes.ASSIGN_MATERIAL_TO_TEACHER.authenticate,
    undefined,
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
export const getAssignMaterialToTeacher = async id => {
  logger(id);
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_ASSIGN_MATERIAL_TO_TEACHER.service,
    ApiRoutes.GET_ASSIGN_MATERIAL_TO_TEACHER.url.replace(":id", id),
    ApiRoutes.GET_ASSIGN_MATERIAL_TO_TEACHER.method,
    ApiRoutes.GET_ASSIGN_MATERIAL_TO_TEACHER.authenticate
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
export const deleteMaterial = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DELETE_MATERIAL.service,
    ApiRoutes.DELETE_MATERIAL.url,
    ApiRoutes.DELETE_MATERIAL.method,
    ApiRoutes.DELETE_MATERIAL.authenticate,
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




export const getMaterialDetails = async id => {

  
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_MATERIAL_DETAILS.service,
    ApiRoutes.GET_MATERIAL_DETAILS.url.replace(":id", id),
    ApiRoutes.GET_MATERIAL_DETAILS.method,
    ApiRoutes.GET_MATERIAL_DETAILS.authenticate
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
  
}