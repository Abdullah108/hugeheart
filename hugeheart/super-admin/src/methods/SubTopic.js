import ApiRoutes from "../config/ApiRoutes";
import { ApiHelper, ErrorMessage } from "../helpers";

export const getSubTopics = async data => {
  console.log(ApiRoutes);
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.GET_SUB_TOPICS.service,
    ApiRoutes.GET_SUB_TOPICS.url,
    ApiRoutes.GET_SUB_TOPICS.method,
    ApiRoutes.GET_SUB_TOPICS.authenticate,
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

export const addSubTopic = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.ADD_SUB_TOPICS.service,
    ApiRoutes.ADD_SUB_TOPICS.url,
    ApiRoutes.ADD_SUB_TOPICS.method,
    ApiRoutes.ADD_SUB_TOPICS.authenticate,
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
