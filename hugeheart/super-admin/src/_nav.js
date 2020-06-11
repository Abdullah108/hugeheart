import { AppRoutes } from "./config";
import { Translation } from "./translation";
export default {
  items: [
    {
      name: Translation.DASHBOARD,
      url: AppRoutes.HOME,
      icon: "fa fa-dashboard"
    },
    {
      name: Translation.MASTER_ADMIN_TEXT,
      icon: "fa fa-users",
      url: AppRoutes.USERS
    },
    {
      name: `Teachers`,
      icon: "fa fa-graduation-cap",
      url: AppRoutes.TEACHERS
    },
    {
      name: Translation.BRAND_AMBASSADOR,
      icon: "fa fa-users",
      url: AppRoutes.GET_BRAND_AMBASSADOR
    },
    {
      name: "Students",
      icon: "fa fa-users",
      url: AppRoutes.STUDENTS
    },
    {
      name: "Material Folders",
      icon: "fa fa-folder-o",
      url: AppRoutes.MATERIAL_FOLDERS
    },
    {
      name: `Curriculum`,
      icon: "fa fa-folder-o",
      url: AppRoutes.CURRICULUM_FOLDERS
    },
    {
      name: `Principles & Marketing Materials`,
      icon: "fa fa-question",
      url: AppRoutes.PRINCIPLE
    },
    {
      name: `Notifications`,
      icon: "fa fa-bell",
      url: AppRoutes.NOTIFICATION
    },
    {
      name: `Contact`,
      icon: "fa fa-phone",
      url: AppRoutes.CONTACT
    },
    {
      name: `Video Conference`,
      icon: "fa fa-video-camera",
      url: AppRoutes.VIDEO
    }
  ]
};
