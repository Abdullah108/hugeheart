import { AppRoutes } from "./config";
import { Translation } from "./translation";
export default {
  items: [
    {
      name: Translation.DASHBOARD,
      url: AppRoutes.HOME,
      icon: "fa fa-dashboard",
      role: ["teacher", "brandamb", "student", "masteradmin"],
    },
    {
      name: Translation.BRAND_AMBASSADOR,
      icon: "fa fa-users",
      url: AppRoutes.GET_BRAND_AMBASSADOR,
      role: ["masteradmin"],
    },
    {
      name: Translation.TEACHER,
      icon: "fa fa-graduation-cap",
      url: AppRoutes.GET_TEACHER,
      role: ["masteradmin"],
    },
    {
      name: Translation.SETTINGS,
      icon: "fa fa-cog",
      url: AppRoutes.SETTINGS,
      role: [],
    },
    {
      name: "Tasks",
      icon: "fa fa-tasks",
      url: AppRoutes.TASKS,
      role: ["brandamb"],
    },
    {
      name: "Students",
      icon: "fa fa-users",
      url: AppRoutes.STUDENTS,
      role: ["masteradmin", "brandamb", "teacher"],
    },
    {
      name: "Payments",
      icon: "fa fa-dollar",
      url: AppRoutes.PAYMENT,
      role: ["masteradmin"],
      children: [
        {
          name: "Incomes",
          url: AppRoutes.PAYMENT_INCOME,
          icon: "fa fa-download",
        },
        {
          name: "Expenses",
          url: AppRoutes.PAYMENT_EXPENSE,
          icon: "fa fa-upload",
        },
      ],
    },
    {
      name: `Notifications`,
      icon: "fa fa-bell",
      url: AppRoutes.NOTIFICATION,
      role: ["masteradmin", "teacher"],
    },
    {
      name: "Material Folders",
      icon: "fa fa-folder-o",
      url: AppRoutes.MATERIAL_FOLDERS,
      role: ["teacher"],
    },
    {
      name: "Materials",
      icon: "fa fa-files-o",
      url: AppRoutes.STUDENT_MATERIAL,
      role: ["student"],
    },
    {
      name: `Curriculum`,
      icon: "fa fa-folder-o",
      url: AppRoutes.CURRICULUM_FOLDERS,
      role: ["teacher"],
    },
    {
      name: `Principles & Marketing Materials`,
      icon: "fa fa-question",
      url: AppRoutes.PRINCIPLE,
      role: ["brandamb", "teacher", "masteradmin"],
    },
    {
      name: `Contact`,
      icon: "fa fa-phone",
      url: AppRoutes.CONTACT,
      role: ["brandamb", "teacher", "masteradmin", "student"],
    },
    // {
    //   name: `Video Conference`,
    //   icon: "fa fa-video-camera",
    //   url: AppRoutes.VIDEO
    // }
  ],
};
