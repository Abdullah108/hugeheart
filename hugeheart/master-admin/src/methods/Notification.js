import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, SuccessMessages, ErrorMessage } from "../helpers";

/**
 *
 */
export const getNotification = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.NOTIFICATION.service,
    ApiRoutes.NOTIFICATION.url,
    ApiRoutes.NOTIFICATION.method,
    ApiRoutes.NOTIFICATION.authenticate,
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
