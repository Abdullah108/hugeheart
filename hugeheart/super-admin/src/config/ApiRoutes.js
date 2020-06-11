const ApiRoutes = {
  LOGIN: {
    service: "auth",
    url: "login",
    method: "POST",
    authenticate: false
  },
  PROXY_LOGIN: {
    service: "auth",
    url: "proxy-login/:id",
    method: "POST",
    authenticate: false
  },
  GET_SETTINGS: {
    service: "users",
    url: "details",
    method: "GET",
    authenticate: true
  },
  GET_USERS: {
    service: "master-admin",
    url: "",
    method: "GET",
    authenticate: true
  },
  GET_USER_DETAILS: {
    service: "users",
    url: "details",
    method: "GET",
    authenticate: true
  },
  UPDATE_SETTINGS: {
    service: "users",
    url: "update",
    method: "POST",
    authenticate: true
  },
  UPDATE_PASSWORD: {
    service: "auth",
    url: "update-password",
    method: "POST",
    authenticate: true
  },
  ADD_MASTER_ADMIN: {
    service: "master-admin",
    url: "",
    method: "POST",
    authenticate: true
  },
  DELETE_MASTER_ADMIN: {
    service: "master-admin",
    url: "",
    method: "DELETE",
    authenticate: true
  },
  UPDATE_STATUS: {
    service: "master-admin",
    url: "",
    method: "PATCH",
    authenticate: true
  },
  GET_MASTER_ADMIN_DETAILS: {
    service: "master-admin",
    url: ":id",
    method: "GET",
    authenticate: true
  },
  UPDATE_MASTER_ADMIN_DETAILS: {
    service: "master-admin",
    url: ":id",
    method: "PUT",
    authenticate: true
  },
  //
  GET_TEACHERS: {
    service: "teachers",
    url: "",
    method: "GET",
    authenticate: true
  },
  ADD_TEACHERS: {
    service: "teachers",
    url: "",
    method: "POST",
    authenticate: true
  },
  UPDATE_TEACHERS: {
    service: "teachers",
    url: ":id",
    method: "PUT",
    authenticate: true
  },
  DELETE_TEACHER: {
    service: "teachers",
    url: "",
    method: "DELETE",
    authenticate: true
  },
  UPDATE_TEACHER_STATUS: {
    service: "teachers",
    url: "",
    method: "PATCH",
    authenticate: true
  },
  GET_TEACHER_DETAILS: {
    service: "teachers",
    url: ":id",
    method: "GET",
    authenticate: true
  },
  GET_TEACHER_SCHEDULE: {
    service: "teachers",
    url: "get-teacher-schedule",
    method: "GET",
    authenticate: true
  },
  //
  GET_TOPICS: {
    service: "topics",
    url: "",
    method: "GET",
    authenticate: true
  },
  ADD_TOPICS: {
    service: "topics",
    url: "",
    method: "POST",
    authenticate: true
  },
  GET_ASSIGNED_TEACHERS: {
    service: "teacher-ma",
    url: ":id",
    method: "GET",
    authenticate: true
  },
  ASIGN_NEW_TEACHER: {
    service: "teacher-ma",
    url: "",
    method: "POST",
    authenticate: true
  },
  GET_SUB_TOPICS: {
    service: "subtopics",
    url: "",
    method: "GET",
    authenticate: true
  },
  ADD_SUB_TOPICS: {
    service: "subtopics",
    url: "",
    method: "POST",
    authenticate: true
  },
  ADD_MATERIAL: {
    service: "material",
    url: "",
    method: "POST",
    authenticate: true
  },
  UPDATE_MATERIAL: {
    service: "material",
    url: ":id",
    method: "PUT",
    authenticate: true
  },
  DELETE_MATERIAL: {
    service: "material",
    url: "",
    method: "DELETE",
    authenticate: true
  },
  GET_MATERIAL_DETAILS: {
    service: "material",
    url: ":id",
    method: "GET",
    authenticate: true
  },
  UNASIGN_NEW_TEACHER: {
    service: "teacher-ma",
    url: "",
    method: "PATCH",
    authenticate: true
  },
  ADD_NEW_TRAINING_FOR_TEACHER: {
    service: "teacher-training",
    url: "",
    method: "POST",
    authenticate: true
  },
  GET_BRAND_AMBASSADOR: {
    service: "brand",
    url: "get-brand",
    method: "GET",
    authenticate: true
  },
  ADD_BRAND_AMBASSADOR: {
    service: "brand",
    url: "add-brand",
    method: "POST",
    authenticate: true
  },
  VIEW_BRAND_AMBASSADOR: {
    service: "brand",
    url: "view-brand/:id",
    method: "GET",
    authenticate: true
  },
  UPDATE_BRAND_AMBASSADOR: {
    service: "brand",
    url: ":id",
    method: "PUT",
    authenticate: true
  },
  DELETE_BRAND_AMBASSADOR: {
    service: "brand",
    url: "delete-brand",
    method: "PUT",
    authenticate: true
  },
  UPDATE_BRAND_AMBASSADOR_STATUS: {
    service: "brand",
    url: "brand-status",
    method: "PUT",
    authenticate: true
  },
  ASSIGN_TASK_TO_BRAND: {
    service: "brand",
    url: "assign-task",
    method: "POST",
    authenticate: true
  },
  VIEW_ASSIGN_TASK_TO_BRAND: {
    service: "brand",
    url: "view-task/:id",
    method: "GET",
    authenticate: true
  },
  MARK_ASSIGN_TASK_TO_BRAND: {
    service: "brand",
    url: "mark-task/:id",
    method: "PUT",
    authenticate: true
  },
  ADD_NEW_TRAINING_FOR_BRAND_AMB: {
    service: "brand",
    url: "",
    method: "POST",
    authenticate: true
  },
  GET_MATERIALS: {
    service: "material",
    url: "",
    method: "GET",
    authenticate: true
  },
  ASSIGN_MATERIAL_TO_TEACHER: {
    service: "teacher-material-assign",
    url: ":id",
    method: "PATCH",
    authenticate: true
  },
  GET_ASSIGN_MATERIAL_TO_TEACHER: {
    service: "teacher-material-assign",
    url: ":id",
    method: "GET",
    authenticate: true
  },
  ADD_PRINCIPLE: {
    service: "principle",
    url: "",
    method: "POST",
    authenticate: true
  },
  GET_PRINCIPLE: {
    service: "principle",
    url: "",
    method: "GET",
    authenticate: true
  },
  GET_PRINCIPLE_DETAILS: {
    service: "principle",
    url: ":id",
    method: "GET",
    authenticate: true
  },
  UPDATE_PRINCIPLE_DETAILS: {
    service: "principle",
    url: ":id",
    method: "PUT",
    authenticate: true
  },
  DELETE_PRINCIPLE: {
    service: "principle",
    url: "",
    method: "DELETE",
    authenticate: true
  },
  NOTIFICATION: {
    service: "notification",
    url: "",
    method: "GET",
    authenticate: true
  },
  SEND_MESSAGE: {
    service: "message",
    url: "",
    method: "POST",
    authenticate: true
  },
  SEND_FILE: {
    service: "message-file",
    url: "",
    method: "POST",
    authenticate: true
  },
  GET_MESSAGE: {
    service: "message",
    url: "",
    method: "GET",
    authenticate: true
  },
  GET_FOLDER: {
    service: "folders",
    url: "",
    method: "GET",
    authenticate: true
  },
  ADD_FOLDER: {
    service: "folders",
    url: "",
    method: "POST",
    authenticate: true
  },
  ADD_FOLDER_BY_ZIP: {
    service: "folders",
    url: "upload-zip",
    method: "POST",
    authenticate: true
  },
  DELETE_FOLDER: {
    service: "folders",
    url: "",
    method: "DELETE",
    authenticate: true
  },
  UPDATE_FOLDER: {
    service: "folders",
    url: ":id",
    method: "PUT",
    authenticate: true
  },
  ADD_CURRICULUM_FOLDER_BY_ZIP: {
    service: "folders",
    url: "upload-curriculum-zip",
    method: "POST",
    authenticate: true
  },
  GET_CURRICULUMS: {
    service: "curriculum",
    url: "",
    method: "GET",
    authenticate: true
  },
  DELETE_CURRICULUM: {
    service: "curriculum",
    url: "",
    method: "DELETE",
    authenticate: true
  },
  ADD_CURRICULUM: {
    service: "curriculum",
    url: "",
    method: "POST",
    authenticate: true
  },
  UPDATE_CURRICULUM: {
    service: "curriculum",
    url: ":id",
    method: "PUT",
    authenticate: true
  },
  //Student Section
  GET_STUDENTS: {
    service: "students",
    url: "",
    method: "GET",
    authenticate: true
  },
  GET_STUDENT_DETAILS: {
    service: "students",
    url: ":id",
    method: "GET",
    authenticate: true
  },
  ADD_STUDENT: {
    service: "students",
    url: "",
    method: "POST",
    authenticate: true
  },
  UPDATE_STUDENT: {
    service: "students",
    url: ":id",
    method: "PUT",
    authenticate: true
  },
  DELETE_STUDENT: {
    service: "students",
    url: "delete-student",
    method: "PUT",
    authenticate: true
  },
  UPDATE_STUDENT_STATUS: {
    service: "students",
    url: "",
    method: "PUT",
    authenticate: true
  },
  ASSIGN_TEACHER_TO_STUDENT: {
    service: "students",
    url: "assign-teacher",
    method: "POST",
    authenticate: true
  },
  GET_STUDENT_SCHEDULE: {
    service: "students",
    url: "schedule",
    method: "GET",
    authenticate: true
  },
  ENROLL_STUDENT: {
    service: "students",
    url: "enroll/:id",
    method: "PUT",
    authenticate: true
  },
  // Dashboard router
  DASHBOARD_TEACHER_SCHEDULE: {
    service: "dashboard",
    url: "teacher-schedule",
    method: "GET",
    authenticate: true
  },
  // Price Guide
  PRICE_GUIDE_UPDATE: {
    service: "price-guide",
    url: "",
    method: "PUT",
    authenticate: true
  },
  PRICE_GUIDES: {
    service: "price-guide",
    url: "",
    method: "GET",
    authenticate: true
  }
};

export default ApiRoutes;
