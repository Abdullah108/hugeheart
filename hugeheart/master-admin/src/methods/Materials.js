import { ApiHelper, ErrorMessage, logger } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";
/**
 *
 */
export const getMaterials = async (data, folderId) => {
  logger(data);
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_MATERIALS.service,
    ApiRoutes.GET_MATERIALS.url.replace(":folderId", folderId),
    ApiRoutes.GET_MATERIALS.method,
    ApiRoutes.GET_MATERIALS.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: "Material fetched successfully."
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
export const requestUpdate = async data => {
  logger(data);
  const res = await new ApiHelper().postFormData(
    ApiRoutes.REQUEST_UPDATE_MATERIALS.service,
    ApiRoutes.REQUEST_UPDATE_MATERIALS.url,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: "Material fetched successfully."
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE
    };
  }
};
