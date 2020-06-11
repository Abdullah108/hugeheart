import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, ErrorMessage } from "../helpers";

export const getTopics = async () => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_TOPICS.service,
    ApiRoutes.GET_TOPICS.url,
    ApiRoutes.GET_TOPICS.method,
    ApiRoutes.GET_TOPICS.authenticate
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
