import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, ErrorMessage } from "../helpers";

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
