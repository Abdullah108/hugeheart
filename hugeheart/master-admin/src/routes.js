import React from "react";
import { AppRoutes } from "./config";
import { Translation } from "./translation";

const Dashboard = React.lazy(() => import("./views/Dashboard/Dashboard"));
const MyProfile = React.lazy(() => import("./views/MyProfile/MyProfile"));

const Setting = React.lazy(() => import("./views/Settings"));

const BrandAmbassador = React.lazy(() => import("./views/BrandAmbassador"));
const AddBrandAmbassador = React.lazy(() =>
  import("./views/BrandAmbassador/AddBrandAmbassador/AddBrandAmbassador")
);
const ViewBrandAmbassador = React.lazy(() =>
  import("./views/BrandAmbassador/BrandDetails")
);
const Students = React.lazy(() => import("./views/Students"));
const AddStudent = React.lazy(() => import("./views/Students/AddStudent"));
const ViewStudent = React.lazy(() => import("./views/Students/ViewStudent"));

const Teacher = React.lazy(() => import("./views/Teacher"));
const ViewTeacher = React.lazy(() => import("./views/Teacher/TeacherDetails"));
const Tasks = React.lazy(() => import("./views/Tasks"));
const Notifications = React.lazy(() => import("./views/Notification"));
const Materials = React.lazy(() => import("./views/Materials"));
const Principle = React.lazy(() => import("./views/Principle"));
const Contact = React.lazy(() => import("./views/Contact"));
const Folders = React.lazy(() => import("./views/Folders"));
const CurriculumFolders = React.lazy(() =>
  import("./views/Curriculum/Folders")
);
const Curriculum = React.lazy(() => import("./views/Curriculum/"));
const Incomes = React.lazy(() => import("./views/Payments/Incomes"));
const Expenses = React.lazy(() => import("./views/Payments/Expenses"));
const StudentMaterial = React.lazy(() => import("./views/StudentMaterial"));
const VideoConference = React.lazy(() => import("./views/VideoChat/index"));
//
const routes = [
  { path: AppRoutes.MAIN, exact: true, name: "Home" },
  {
    path: AppRoutes.HOME,
    name: Translation.DASHBOARD,
    component: Dashboard,
    exact: true,
  },
  {
    path: AppRoutes.MY_PROFILE,
    exact: true,
    name: Translation.MY_PROFILE,
    component: MyProfile,
  },
  {
    path: AppRoutes.SETTINGS,
    exact: true,
    name: Translation.SETTINGS,
    component: Setting,
  },
  {
    path: AppRoutes.GET_BRAND_AMBASSADOR,
    exact: true,
    name: Translation.AMBASSADOR,
    component: BrandAmbassador,
  },
  {
    path: AppRoutes.ADD_BRAND_AMBASSADOR,
    exact: true,
    name: `New ${Translation.BRAND_AMBASSADOR}`,
    component: AddBrandAmbassador,
  },
  {
    path: AppRoutes.VIEW_BRAND_AMBASSADOR,
    exact: true,
    name: `View ${Translation.BRAND_AMBASSADOR}`,
    component: ViewBrandAmbassador,
  },
  {
    path: AppRoutes.UPDATE_BRAND_AMBASSADOR,
    exact: true,
    name: `Edit ${Translation.BRAND_AMBASSADOR}`,
    component: AddBrandAmbassador,
  },
  {
    path: AppRoutes.GET_TEACHER,
    exact: true,
    name: Translation.GET_TEACHER,
    component: Teacher,
  },
  {
    path: AppRoutes.GET_TEACHER_DETAILS,
    exact: true,
    name: `View Teacher`,
    component: ViewTeacher,
  },
  {
    path: AppRoutes.TASKS,
    exact: true,
    name: "Assigned tasks",
    component: Tasks,
  },
  {
    path: AppRoutes.STUDENTS,
    exact: true,
    name: "Students",
    component: Students,
  },
  {
    path: AppRoutes.ADD_STUDENT,
    exact: true,
    name: "Add Student",
    component: AddStudent,
  },
  {
    path: AppRoutes.NOTIFICATION,
    exact: true,
    name: `${Translation.NOTIFICATION}`,
    component: Notifications,
  },
  {
    path: AppRoutes.MATERIAL,
    exact: true,
    name: "Materials",
    component: Materials,
  },
  {
    name: `Curriculum Folders`,
    exact: true,
    path: AppRoutes.CURRICULUM_FOLDERS,
    component: CurriculumFolders,
  },
  {
    name: `Curriculum`,
    exact: true,
    path: AppRoutes.CURRICULUM,
    component: Curriculum,
  },
  {
    path: AppRoutes.PRINCIPLE,
    exact: true,
    name: `${Translation.PRINCIPLE}`,
    component: Principle,
  },
  {
    path: AppRoutes.CONTACT,
    exact: true,
    name: "Contact",
    component: Contact,
  },
  {
    path: AppRoutes.MATERIAL_FOLDERS,
    exact: true,
    name: "Folders",
    component: Folders,
  },
  {
    path: AppRoutes.VIEW_STUDENT,
    exact: true,
    name: "Student Details",
    component: ViewStudent,
  },
  {
    path: AppRoutes.UPDATE_STUDENT,
    exact: true,
    name: "Student Details",
    component: AddStudent,
  },
  {
    path: AppRoutes.PAYMENT_INCOME,
    exact: true,
    name: "Payment Incomes",
    component: Incomes,
  },
  {
    path: AppRoutes.PAYMENT_EXPENSE,
    exact: true,
    name: "Payment Expenses",
    component: Expenses,
  },
  {
    path: AppRoutes.STUDENT_MATERIAL,
    exact: true,
    name: "Student Materials",
    component: StudentMaterial,
  },
  // {
  //   path: AppRoutes.VIDEO,
  //   exact: true,
  //   name: "Video Conference",
  //   component: VideoConference
  // }
];

export default routes;
