import path from "path";

export const isDevMode = process.env.NODE_ENV == "development";
export const AppURL: string = isDevMode
  ? "http://localhost:8000"
  : "http://portal.hugeheart-edu.com";
export const AppFrontendURL: string = isDevMode
  ? "http://localhost:3001"
  : "http://portal.hugeheart-edu.com";
export const AppAdminURL: string = isDevMode
  ? "http://localhost:3000"
  : "http://portal.hugeheart-edu.com/superadmin";
export const MongoDBURL = isDevMode
  ? "mongodb+srv://sonu:vCK49HTcKWqBew3C@cluster0-5bg57.mongodb.net/hugeheart?retryWrites=true&w=majority"
  : "mongodb+srv://sonu:vCK49HTcKWqBew3C@cluster0-5bg57.mongodb.net/hugeheart?retryWrites=true&w=majority";
export const FilteStorageFolder = "uploads";
export const FileStoragePath = path.join(__dirname, FilteStorageFolder);
export const MaterialFilteStorageFolder = "uploads/material";
export const MaterialFileStoragePath = path.join(
  __dirname,
  MaterialFilteStorageFolder
);

export const ContactFilteStorageFolder = "uploads/contact";
export const ContactFileStoragePath = path.join(
  __dirname,
  ContactFilteStorageFolder
);

export const PrincipleFilteStorageFolder = "uploads/principle";
export const PrincipleFileStoragePath = path.join(
  __dirname,
  PrincipleFilteStorageFolder
);
export const CurriculumFileStorageFolder = "uploads/curriculum";
export const CurriculumFileStoragePath = path.join(
  __dirname,
  CurriculumFileStorageFolder
);
