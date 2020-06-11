import { ApiHelper, ErrorMessage } from "./../helpers";
import ApiRoutes from "../config/ApiRoutes";

export const getPriceGuide = async () => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.PRICE_GUIDES.service,
    ApiRoutes.PRICE_GUIDES.url,
    ApiRoutes.PRICE_GUIDES.method,
    ApiRoutes.PRICE_GUIDES.authenticate
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

export const updatePrice = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.PRICE_GUIDE_UPDATE.service,
    ApiRoutes.PRICE_GUIDE_UPDATE.url,
    ApiRoutes.PRICE_GUIDE_UPDATE.method,
    ApiRoutes.PRICE_GUIDE_UPDATE.authenticate,
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
