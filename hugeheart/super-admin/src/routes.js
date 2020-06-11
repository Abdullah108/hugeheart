import React from "react";
import { AppRoutes } from "./config";
import { Translation } from "./translation";

const Dashboard = React.lazy(() => import("./views/Dashboard/Dashboard"));
const MyProfile = React.lazy(() => import("./views/MyProfile/MyProfile"));

const Setting = React.lazy(() => import("./views/Settings"));

const MasterAdmin = React.lazy(() => import("./views/MasterAdmin"));
const AddMasterAdmin = React.lazy(() =>
  import("./views/MasterAdmin/AddMasterAdmin")
);
const Material = React.lazy(() => import("./views/Material"));
const Folders = React.lazy(() => import("./views/Folders"));
const CurriculumFolders = React.lazy(() =>
  import("./views/Curriculum/Folders")
);
const Curriculum = React.lazy(() => import("./views/Curriculum/"));
const AddCurriculum = React.lazy(() =>
  import("./views/Curriculum/AddCurriculum")
);
const AddMaterial = React.lazy(() => import("./views/Material/AddMaterial"));

const MasterAdminDetails = React.lazy(() =>
  import("./views/MasterAdmin/MasterAdminDetails")
);

const Teachers = React.lazy(() => import("./views/Teacher"));
const AddTeacher = React.lazy(() => import("./views/Teacher/AddTeacher"));
const TeacherDetails = React.lazy(() =>
  import("./views/Teacher/TeacherDetails")
);
const TeacherSchedule = React.lazy(() => import("./views/Teacher/Schedule"));
const BrandAmbassador = React.lazy(() => import("./views/BrandAmbassador"));
const AddBrandAmbassador = React.lazy(() =>
  import("./views/BrandAmbassador/AddBrandAmbassador/AddBrandAmbassador")
);
const ViewBrandAmbassador = React.lazy(() =>
  import("./views/BrandAmbassador/BrandDetails")
);

const Principle = React.lazy(() => import("./views/Principle"));
const AddPrinciple = React.lazy(() => import("./views/Principle/AddPrinciple"));
const PrincipleDetails = React.lazy(() =>
  import("./views/Principle/PrincipleDetails")
);
const Notifications = React.lazy(() => import("./views/Notification"));
const Contact = React.lazy(() => import("./views/Contact"));
const Students = React.lazy(() => import("./views/Students"));
const AddStudent = React.lazy(() => import("./views/Students/AddStudent"));
const ViewStudent = React.lazy(() => import("./views/Students/ViewStudent"));
const VideoConference = React.lazy(() => import("./views/VideoChat/index"));

const routes = [
  { path: AppRoutes.MAIN, exact: true, name: "Home" },
  {
    path: AppRoutes.HOME,
    name: Translation.DASHBOARD,
    component: Dashboard,
    exact: true
  },
  {
    path: AppRoutes.MY_PROFILE,
    exact: true,
    name: Translation.MY_PROFILE,
    component: MyProfile
  },
  {
    path: AppRoutes.SETTINGS,
    exact: true,
    name: Translation.SETTINGS,
    component: Setting
  },
  {
    path: AppRoutes.USERS,
    exact: true,
    name: Translation.MASTER_ADMIN_TEXT,
    component: MasterAdmin
  },
  {
    path: AppRoutes.ADD_USER,
    exact: true,
    name: `New ${Translation.MASTER_ADMIN_TEXT}`,
    component: AddMasterAdmin
  },
  {
    path: AppRoutes.MATERIAL_FOLDERS,
    exact: true,
    name: "Material Folders",
    component: Folders
  },
  {
    path: AppRoutes.MATERIAL,
    exact: true,
    name: Translation.MATERIAL_TEXT,
    component: Material
  },
  {
    path: AppRoutes.ADD_MATERIAL,
    exact: true,
    name: `New ${Translation.MATERIAL_TEXT}`,
    component: AddMaterial
  },
  {
    path: AppRoutes.MATERIAL_DETAILS_EDIT,
    exact: true,
    name: `Edit ${Translation.MATERIAL_TEXT}`,
    component: AddMaterial
  },
  {
    path: AppRoutes.USER_DETAILS_EDIT,
    exact: true,
    name: `Edit ${Translation.MASTER_ADMIN_TEXT}`,
    component: AddMasterAdmin
  },
  {
    path: AppRoutes.USER_DETAILS,
    exact: true,
    name: `View ${Translation.MASTER_ADMIN_TEXT}`,
    component: MasterAdminDetails
  },
  {
    path: AppRoutes.TEACHERS,
    exact: true,
    name: `${Translation.TEACHER}s`,
    component: Teachers
  },
  {
    path: AppRoutes.ADD_TEACHER,
    exact: true,
    name: `New ${Translation.TEACHER}`,
    component: AddTeacher
  },
  {
    path: AppRoutes.TEACHER_DETAILS_EDIT,
    exact: true,
    name: `Edit ${Translation.TEACHER}`,
    component: AddTeacher
  },
  {
    path: AppRoutes.TEACHER_DETAILS,
    exact: true,
    name: `View ${Translation.TEACHER}`,
    component: TeacherDetails
  },
  {
    path: AppRoutes.TEACHER_CALENDAR,
    exact: true,
    name: "Teacher's Schedule",
    component: TeacherSchedule
  },
  {
    path: AppRoutes.GET_BRAND_AMBASSADOR,
    exact: true,
    name: Translation.AMBASSADOR,
    component: BrandAmbassador
  },
  {
    path: AppRoutes.ADD_BRAND_AMBASSADOR,
    exact: true,
    name: `New ${Translation.BRAND_AMBASSADOR}`,
    component: AddBrandAmbassador
  },
  {
    path: AppRoutes.VIEW_BRAND_AMBASSADOR,
    exact: true,
    name: `View ${Translation.BRAND_AMBASSADOR}`,
    component: ViewBrandAmbassador
  },
  {
    path: AppRoutes.UPDATE_BRAND_AMBASSADOR,
    exact: true,
    name: `Edit ${Translation.BRAND_AMBASSADOR}`,
    component: AddBrandAmbassador
  },
  {
    path: AppRoutes.PRINCIPLE,
    exact: true,
    name: `${Translation.PRINCIPLE}`,
    component: Principle
  },
  {
    path: AppRoutes.ADD_PRINCIPLE,
    exact: true,
    name: `New ${Translation.PRINCIPLE}`,
    component: AddPrinciple
  },
  {
    path: AppRoutes.PRINCIPLE_DETAILS,
    exact: true,
    name: `View ${Translation.PRINCIPLE}`,
    component: PrincipleDetails
  },
  {
    path: AppRoutes.PRINCIPLE_DETAILS_EDIT,
    exact: true,
    name: `Edit ${Translation.PRINCIPLE}`,
    component: AddPrinciple
  },
  {
    path: AppRoutes.NOTIFICATION,
    exact: true,
    name: `${Translation.NOTIFICATION}`,
    component: Notifications
  },
  {
    path: AppRoutes.CONTACT,
    exact: true,
    name: "Contact",
    component: Contact
  },
  {
    name: `Curriculum Folders`,
    exact: true,
    path: AppRoutes.CURRICULUM_FOLDERS,
    component: CurriculumFolders
  },
  {
    name: `Curriculum`,
    exact: true,
    path: AppRoutes.CURRICULUM,
    component: Curriculum
  },
  {
    path: AppRoutes.ADD_CURRICULUM,
    exact: true,
    name: `New Curriculum`,
    component: AddCurriculum
  },
  {
    path: AppRoutes.STUDENTS,
    exact: true,
    name: "Students",
    component: Students
  },
  {
    path: AppRoutes.ADD_STUDENT,
    exact: true,
    name: "Add Student",
    component: AddStudent
  },
  {
    path: AppRoutes.VIEW_STUDENT,
    exact: true,
    name: "Student Details",
    component: ViewStudent
  },
  {
    path: AppRoutes.UPDATE_STUDENT,
    exact: true,
    name: "Student Details",
    component: AddStudent
  },
  {
    path: AppRoutes.VIDEO,
    exact: true,
    name: "Video Conference",
    component: VideoConference
  }
];

export default routes;
