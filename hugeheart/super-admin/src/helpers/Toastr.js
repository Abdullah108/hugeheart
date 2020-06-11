import { toast as toastr } from "react-toastify";

export const toast = (message, type) => {
  try {
    toastr.dismiss();
    toastr[type](message);
  } catch (error) {}
};
