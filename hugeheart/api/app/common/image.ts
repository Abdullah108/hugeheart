import multer, { StorageEngine } from "multer";
import {
  FileStoragePath,
  MaterialFileStoragePath,
  PrincipleFileStoragePath,
  CurriculumFileStoragePath,
  ContactFileStoragePath,
} from "../config";

// Upload image File using multer
const storageFile: StorageEngine = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, FileStoragePath);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

// Upload image File using multer
const materialStorageFile: StorageEngine = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, MaterialFileStoragePath);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

// Upload image File using multer
const contactStorageFile: StorageEngine = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, ContactFileStoragePath);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

const curriculumStorageFile: StorageEngine = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, CurriculumFileStoragePath);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const principleStorageFile: StorageEngine = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, PrincipleFileStoragePath);
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

export {
  storageFile,
  materialStorageFile,
  principleStorageFile,
  curriculumStorageFile,
  contactStorageFile,
};
