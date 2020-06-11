import { EnviornmentType } from "../config";

export const logger = (...arg) => {
  if (process.env.NODE_ENV === EnviornmentType.DEV) {
    for (let i = 0; i < arg.length; i++) {
      const data = arg[i];
      console.log("====================================");
      console.log(data);
      console.log("====================================");
    }
  }
};
