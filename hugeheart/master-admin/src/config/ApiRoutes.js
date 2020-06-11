const ApiRoutes = {
  LOGIN: {
    service: "auth",
    url: "login",
    method: "POST",
    authenticate: false,
  },
  GET_SETTINGS: {
    service: "auth",
    url: "profile",
    method: "GET",
    authenticate: true,
  },
  GET_SUPERADMIN: {
    service: "master-admin",
    url: "superadmin",
    method: "GET",
    authenticate: true,
  },
  GET_USERS: {
    service: "master-admin",
    url: "",
    method: "GET",
    authenticate: true,
  },
  GET_USER_DETAILS: {
    service: "auth",
    url: "profile",
    method: "GET",
    authenticate: true,
  },
  UPDATE_SETTINGS: {
    service: "auth",
    url: "update-profile",
    method: "PUT",
    authenticate: true,
  },
  UPDATE_PASSWORD: {
    service: "auth",
    url: "change-password",
    method: "PUT",
    authenticate: true,
  },
  ADD_MASTER_ADMIN: {
    service: "master-admin",
    url: "",
    method: "POST",
    authenticate: true,
  },
  //Brand Ambassador
  GET_BRAND_AMBASSADOR: {
    service: "brand",
    url: "get-brand",
    method: "GET",
    authenticate: true,
  },
  ADD_BRAND_AMBASSADOR: {
    service: "brand",
    url: "add-brand",
    method: "POST",
    authenticate: true,
  },
  VIEW_BRAND_AMBASSADOR: {
    service: "brand",
    url: "view-brand/:id",
    method: "GET",
    authenticate: true,
  },
  UPDATE_BRAND_AMBASSADOR: {
    service: "brand",
    url: ":id",
    method: "PUT",
    authenticate: true,
  },
  DELETE_BRAND_AMBASSADOR: {
    service: "brand",
    url: "delete-brand",
    method: "PUT",
    authenticate: true,
  },
  UPDATE_BRAND_AMBASSADOR_STATUS: {
    service: "brand",
    url: "brand-status",
    method: "PUT",
    authenticate: true,
  },
  ASSIGN_TASK_TO_BRAND: {
    service: "brand",
    url: "assign-task",
    method: "POST",
    authenticate: true,
  },
  VIEW_ASSIGN_TASK_TO_BRAND: {
    service: "brand",
    url: "view-task/:id",
    method: "GET",
    authenticate: true,
  },
  MARK_ASSIGN_TASK_TO_BRAND: {
    service: "brand",
    url: "mark-task/:id",
    method: "PUT",
    authenticate: true,
  },
  ADD_NEW_TRAINING_FOR_BRAND_AMB: {
    service: "brand",
    url: "",
    method: "POST",
    authenticate: true,
  },
  GET_TEACHERS: {
    service: "teacher",
    url: "",
    method: "GET",
    authenticate: true,
  },
  GET_TEACHER_DETAILS: {
    service: "teacher",
    url: ":id",
    method: "GET",
    authenticate: true,
  },
  GET_TEACHER_SCHEDULE: {
    service: "teacher",
    url: "get-teacher-schedule",
    method: "GET",
    authenticate: true,
  },
  UPDATE_TASK_STATUS_BY_BA: {
    service: "brand",
    url: ":id",
    method: "PUT",
    authenticate: true,
  },
  NOTIFICATION: {
    service: "notification",
    url: "",
    method: "GET",
    authenticate: true,
  },
  GET_MATERIALS: {
    service: "teacher-material-assign",
    url: ":folderId",
    method: "GET",
    authenticate: true,
  },
  REQUEST_UPDATE_MATERIALS: {
    service: "teacher-material-assign",
    url: "",
    method: "POST",
    authenticate: true,
  },
  GET_PRINCIPLE: {
    service: "principle",
    url: "",
    method: "GET",
    authenticate: true,
  },

  SEND_MESSAGE: {
    service: "message",
    url: "",
    method: "POST",
    authenticate: true,
  },
  GET_MESSAGE: {
    service: "message",
    url: "",
    method: "GET",
    authenticate: true,
  },
  GET_FOLDER: {
    service: "teacher-material-assign",
    url: "",
    method: "GET",
    authenticate: true,
  },

  //Student Section
  GET_STUDENTS: {
    service: "students",
    url: "",
    method: "GET",
    authenticate: true,
  },
  GET_STUDENT_DETAILS: {
    service: "students",
    url: ":id",
    method: "GET",
    authenticate: true,
  },
  ADD_STUDENT: {
    service: "students",
    url: "",
    method: "POST",
    authenticate: true,
  },
  UPDATE_STUDENT: {
    service: "students",
    url: ":id",
    method: "PUT",
    authenticate: true,
  },
  DELETE_STUDENT: {
    service: "students",
    url: "delete-student",
    method: "PUT",
    authenticate: true,
  },
  UPDATE_STUDENT_STATUS: {
    service: "students",
    url: "",
    method: "PUT",
    authenticate: true,
  },
  ENROLL_STUDENT: {
    service: "students",
    url: "enroll/:id",
    method: "PUT",
    authenticate: true,
  },
  LEAVE_FEEBACK: {
    service: "students",
    url: "leave-feedback",
    method: "POST",
    authenticate: true,
  },
  LEAVE_REQUEST: {
    service: "students",
    url: "leave-request/:id",
    method: "PUT",
    authenticate: true,
  },
  GET_STUDENT_SCHEDULE: {
    service: "students",
    url: "schedule",
    method: "GET",
    authenticate: true,
  },
  TEACHER_SCHEDULE: {
    service: "teacher",
    url: "teacher-schedule",
    method: "GET",
    authenticate: true,
  },
  // Curriculum
  GET_CURRICULUMS: {
    service: "curriculum",
    url: "",
    method: "GET",
    authenticate: true,
  },
  // for topics
  GET_TOPICS: {
    service: "topics",
    url: "",
    method: "GET",
    authenticate: true,
  },
  // Price guide
  PRICE_GUIDES: {
    service: "price-guide",
    url: "",
    method: "GET",
    authenticate: true,
  },
};

export default ApiRoutes;
