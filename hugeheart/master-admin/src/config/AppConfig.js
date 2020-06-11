export const EnviornmentType = {
  DEV: "development",
  PROD: "production",
};
export const env = process.env.NODE_ENV || EnviornmentType.DEV;

export const AppConfig = {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
  API_VERSION: process.env.REACT_APP_API_VERSION,
  DEFAULT_DATE_FORMAT: "LLL",
  DEFAULT_ONLY_DATE_FORMAT: "MM-DD-YYYY",
  SERVER_FILES_ENDPOINT: process.env.REACT_APP_URL,
  ITEMS_PER_PAGE: 10,
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || process.env.REACT_APP_URL,
};
export const TokenKey = "token";
