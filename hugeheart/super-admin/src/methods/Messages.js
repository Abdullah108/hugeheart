import { ApiHelper, ErrorMessage } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";

export const sendMessage = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.SEND_MESSAGE.service,
    ApiRoutes.SEND_MESSAGE.url,
    ApiRoutes.SEND_MESSAGE.method,
    ApiRoutes.SEND_MESSAGE.authenticate,
    undefined,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data
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
export const getAllMessages = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_MESSAGE.service,
    ApiRoutes.GET_MESSAGE.url,
    ApiRoutes.GET_MESSAGE.method,
    ApiRoutes.GET_MESSAGE.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data
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
 * @param {*} data 
 */
export const sendFile = async data => {
  const res = await new ApiHelper().postFormData(
    ApiRoutes.SEND_MESSAGE.service,
    ApiRoutes.SEND_MESSAGE.url,
    data
  );

  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE
    };
  }
}
