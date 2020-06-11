import { AppConfig } from "../config/AppConfig";
import { ErrorHandlerHelper } from "./ErrorHandlerHelper";
import { SuccessHandlerHelper } from "./SuccessHandlerHelper";
import Axios from "axios";

/**
 * ApiHelper Class - For making Api Requests
 */
export class ApiHelper {
  _portalGateway;
  _apiVersion;

  constructor() {
    this._portalGateway = AppConfig.API_ENDPOINT;
    this._apiVersion = AppConfig.API_VERSION;
  }
  setHost = (host) => {
    this._portalGateway = host;
  };
  setApiVersion = (version) => {
    this._apiVersion = version;
  };
  /**
   * Fetches from the Gateway defined by the instantiated object. Accepts <T> as output object.
   * @example <caption>"/Auth/UserAccount", "/GetCurrentUser", "GET", "JWT Content"</caption>
   * @param {service} service - wanting to be access ex. "UserAuth/Auth"
   * @param {endpoint} endpoint - you wish to call ex. "/Login"
   * @param {method} mehotd - method (GET, UPDATE, DELETE, POST)
   * @param {jwt} JWT - JSON Web Token (Optional)
   * @param {queryOptions} Query - query options for "GET" methods (Optional)
   * @param {body} body - JSON body for "UPDATE, DELETE and POST" methods (Optional)
   */
  async FetchFromServer(
    service,
    endpoint,
    method,
    authenticated = false,
    queryOptions = undefined,
    body = undefined
  ) {
    let url = `${this._portalGateway}/${this._apiVersion}/${service}/${endpoint}`;
    let headers = { "Content-Type": "application/json" };
    if (authenticated) {
      const storageSession = localStorage.getItem("token");
      headers.Authorization = storageSession;
    }

    try {
      method = method.toLowerCase();
      let response = await Axios.request({
        method,
        url,
        data: body,
        headers: headers,
        params: queryOptions,
      });

      if (response.ok === false || response.status !== 200) {
        let errorObject = {
          code: response.status,
          data: response.data,
        };

        throw errorObject;
      }
      const data = new SuccessHandlerHelper(response.data);
      return data.data;
    } catch (err) {
      if (err.response) {
        const errorHelper = new ErrorHandlerHelper(err.response);
        return errorHelper.error;
      }
      const errorHelper = new ErrorHandlerHelper({});
      return errorHelper.error;
    }
  }
  /**
   *
   */
  postFormData = async (service, endpoint, body, jsonInput = []) => {
    let fd = new FormData();

    for (const k in body) {
      if (body.hasOwnProperty(k)) {
        const element = body[k];
        if (jsonInput.indexOf(k) > -1) {
          fd.append(k, JSON.stringify(element));
        } else {
          fd.append(k, element);
        }
      }
    }
    let url = `${this._portalGateway}/${this._apiVersion}/${service}/${endpoint}`;
    let options = { method: "POST" };
    options.headers = {};
    const storageSession = localStorage.getItem("token");
    options.headers.Authorization = storageSession;

    try {
      let response = await Axios.post(`${url}`, fd, {
        headers: options.headers,
      });

      if (response.status < 200 || response.status >= 300) {
        let errorObject = {
          code: response.status,
          response: response.data,
        };

        throw errorObject;
      }
      const data = new SuccessHandlerHelper(response.data);
      return data.data;
    } catch (err) {
      if (err.response) {
        const errorHelper = new ErrorHandlerHelper(err.response);
        return errorHelper.error;
      }
      const errorHelper = new ErrorHandlerHelper({});
      return errorHelper.error;
    }
  };
}
