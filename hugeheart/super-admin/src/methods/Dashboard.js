import { ApiHelper, ErrorMessage } from "../helpers";
import ApiRoutes from "../config/ApiRoutes";
/**
 *
 */
export const getDashboardTecherSchedule = async data => {
  const res = await new ApiHelper().FetchFromServer(
    ApiRoutes.DASHBOARD_TEACHER_SCHEDULE.service,
    ApiRoutes.DASHBOARD_TEACHER_SCHEDULE.url,
    ApiRoutes.DASHBOARD_TEACHER_SCHEDULE.method,
    ApiRoutes.DASHBOARD_TEACHER_SCHEDULE.authenticate,
    data
  );
  if (!res.isError) {
    return {
      isSuccess: true,
      data: res.data,
      message: "Dashboard data fetched successfully."
    };
  } else {
    return {
      isSuccess: false,
      message: res.messages[0] || ErrorMessage.DEFAULT_EROR_MESSAGE
    };
  }
};
