import Validator, { ValidationTypes } from "js-object-validation";

import { ErrorMessage } from "../helpers/Message";
import { ApiHelper } from "../helpers/ApiHelper";
import ApiRoutes from "../config/ApiRoutes";
import { Translation } from "../translation";
import { TokenKey, AppConfig, ProxyTokenKey } from "../config";

export const login = async userData => {
  const validator = {
    email: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.EMAIL]: true
    },
    password: {
      [ValidationTypes.REQUIRED]: true,
      [ValidationTypes.MINLENGTH]: 6,
      [ValidationTypes.MAXLENGTH]: 20
    }
  };
  const messages = {
    email: {
      [ValidationTypes.REQUIRED]: Translation.REQUIRED_EMAIL_MESSAGE,
      [ValidationTypes.EMAIL]: Translation.VALID_EMAIL_MESSAGE
    },
    password: {
      [ValidationTypes.REQUIRED]: Translation.REQUIRED_PASSWORD_MESSAGE,
      [ValidationTypes.MINLENGTH]: Translation.MINLENGTH_PASSWORD_MESSAGE,
      [ValidationTypes.MAXLENGTH]: Translation.MAXLENGTH_PASSWORD_MESSAGE
    }
  };
  const { isValid, errors } = Validator(userData, validator, messages);
  if (!isValid) {
    return {
      isSuccess: false,
      errors
    };
  }
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.LOGIN.service,
    ApiRoutes.LOGIN.url,
    ApiRoutes.LOGIN.method,
    ApiRoutes.LOGIN.authenticate,
    undefined,
    userData
  );
  if (!res.isError) {
    localStorage.setItem(TokenKey, res.data.token);
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

export const proxyLogin = async id => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.PROXY_LOGIN.service,
    ApiRoutes.PROXY_LOGIN.url.replace(":id", id.id),
    ApiRoutes.PROXY_LOGIN.method,
    ApiRoutes.PROXY_LOGIN.authenticate
  );
  if (!res.isError) {
    localStorage.setItem(ProxyTokenKey, res.data.token);
    window.open(AppConfig.MASTER_ADMIN_URL, "_blank");
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
