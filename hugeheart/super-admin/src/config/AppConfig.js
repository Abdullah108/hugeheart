export const EnviornmentType = {
  DEV: "development",
  PROD: "production"
};
export const env = process.env.NODE_ENV || EnviornmentType.DEV;

export const AppConfig = {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
  API_VERSION: process.env.REACT_APP_API_VERSION,
  DEFAULT_DATE_FORMAT: "LLL",
  DEFAULT_ONLY_DATE_FORMAT: "MM-DD-YYYY",
  SERVER_FILES_ENDPOINT: process.env.REACT_APP_URL,
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || process.env.REACT_APP_URL,
  MASTER_ADMIN_URL: process.env.REACT_APP_MASTER_ADMIN_URL || process.env.REACT_APP_FRONTEND_URL || process.env.REACT_APP_URL,
  ITEMS_PER_PAGE: 10
};
export const TokenKey = "adminToken";
export const ProxyTokenKey = "token";
