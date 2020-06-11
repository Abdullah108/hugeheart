import { ErrorMessage, getIpAddress } from "../common";
import { Response, Request } from "express";
import {
  FolderModel,
  MaterialModel,
  CurriculumModel,
  TeacherMaterialAssignModel,
} from "../models";
import extract from "extract-zip";
import path from "path";
import fs from "fs";
import {
  MaterialFilteStorageFolder,
  CurriculumFileStorageFolder,
} from "../config";
import moment from "moment";
/**
 *
 */
export const addFolder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { folderName, type, selectedTeachers } = body;
    const { id } = currentUser;
    const folder = await FolderModel.create({
      folderName,
      createdBy: id,
      type: type,
      createdIP: getIpAddress(req),
    });
    let teacherMaterials: any[] = [];
    if (selectedTeachers && selectedTeachers.map) {
      teacherMaterials = selectedTeachers.map((teacherId: string) => ({
        folderId: folder._id,
        teacherId,
        createdBy: currentUser.id,
      }));
    }
    await TeacherMaterialAssignModel.create(teacherMaterials);
    return res.status(200).send({
      message: "Folder added successfully.",
      teacherMaterials,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
/**
 *
 */
export const udpateFolder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser, params } = req;
    const { id: folderId } = params;
    const { folderName } = body;
    const { id } = currentUser;
    await FolderModel.updateOne(
      {
        _id: folderId,
      },
      {
        $set: {
          folderName,
          updatedBy: id,
          updatedIP: getIpAddress(req),
          updatedAt: Date.now(),
        },
      }
    );
    return res.status(200).send({
      message: "Folder Details updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
/**
 *
 */
export const getFolders = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const { search, type } = query;
    let condition: any = {
      isDeleted: false,
    };
    if (search) {
      condition["folderName"] = {
        $regex: new RegExp(search, "i"),
      };
    }
    if (type) {
      condition["type"] = type;
    } else {
      condition["$or"] = [
        {
          type: {
            $exists: false,
          },
        },
        {
          type: "material",
        },
      ];
    }
    const result = await FolderModel.find({
      ...condition,
    }).sort({
      createdAt: -1,
    });
    return res.status(200).send({
      message: "Folders fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};

/**
 *
 */
export const uploadFolder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, file, currentUser } = req;
    const { class: year, subject, folderName, selectedTeachers } = body;
    const foldername = `${folderName}_${moment().unix()}`;
    const folderData = await FolderModel.create({
      folderName,
      createdBy: currentUser.id,
    });
    const folderId = folderData._id;
    const data = await new Promise((resolve, reject) => {
      extract(
        `${path.join(file.destination, file.filename)}`,
        {
          dir: path.join(file.destination, foldername),
        },
        (err: any) => {
          console.log(err);
          if (err) {
            reject(err);
          }
          const items: any[] = fs.readdirSync(
            path.join(file.destination, foldername)
          );
          const resdata: any[] = [];
          for (var i = 0; i < items.length; i++) {
            const newPath = path.join(file.destination, foldername, items[i]);
            const fsData = fs.lstatSync(newPath);
            const isDirectory = fsData.isDirectory();
            const isFile = fsData.isFile();
            console.log(isDirectory);
            if (isDirectory) {
              const newItems: any[] = fs.readdirSync(newPath);
              for (var j = 0; j < newItems.length; j++) {
                const newSubPath = path.join(
                  file.destination,
                  foldername,
                  items[i],
                  newItems[j]
                );
                const fsSubData = fs.lstatSync(newSubPath);
                if (fsSubData.isFile()) {
                  const fileNameSub = `${moment().unix()}_${newItems[j]}`;
                  resdata.push({
                    class: year,
                    subject,
                    status: "active",
                    createdBy: currentUser.id,
                    materialName: newItems[j],
                    file: newItems[j],
                    fileURL: `/${MaterialFilteStorageFolder}/${fileNameSub}`,
                    folderId,
                  });
                  try {
                    fs.renameSync(
                      newSubPath,
                      path.join(file.destination, fileNameSub)
                    );
                  } catch (error) {
                    reject(error);
                  }
                }
              }
            } else if (isFile) {
              const fileNameSub = `${moment().unix()}_${items[i]}`;
              resdata.push({
                class: year,
                subject,
                status: "active",
                createdBy: currentUser.id,
                materialName: items[i],
                file: items[i],
                fileURL: `/${MaterialFilteStorageFolder}/${fileNameSub}`,
                folderId,
              });
              try {
                fs.renameSync(
                  newPath,
                  path.join(file.destination, fileNameSub)
                );
              } catch (error) {
                reject(error);
              }
            }
          }
          resolve(resdata);
        }
      );
    });
    try {
      fs.unlinkSync(`${path.join(file.destination, file.filename)}`);
    } catch (error) {}
    await MaterialModel.create(data);
    let teacherMaterials: any[] = [];

    if (selectedTeachers) {
      teacherMaterials = selectedTeachers
        .split(",")
        .map((teacherId: string) => ({
          folderId,
          teacherId,
          createdBy: currentUser.id,
        }));
    }
    await TeacherMaterialAssignModel.create(teacherMaterials);
    return res.status(200).send({
      message: "Folder data saved successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
/**
 *
 */
export const deleteFolder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { ids } = body;
    await FolderModel.deleteMany({
      _id: {
        $in: ids,
      },
    });
    await MaterialModel.deleteMany({
      folderId: {
        $in: ids,
      },
    });
    return res.status(200).send({
      message: `${ids.length > 1 ? "Folders" : "Folder"} deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
/**
 *
 */
export const uploadCurriculumFolder = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, file, currentUser } = req;
    const { folderName, country, state } = body;
    const foldername = `${folderName}_${moment().unix()}`;
    const folderData = await FolderModel.create({
      folderName,
      type: "curriculum",
      createdBy: currentUser.id,
    });
    const folderId = folderData._id;
    const data = await new Promise((resolve, reject) => {
      extract(
        `${path.join(file.destination, file.filename)}`,
        {
          dir: path.join(file.destination, foldername),
        },
        (err: any) => {
          console.log(err);
          if (err) {
            reject(err);
          }
          const items: any[] = fs.readdirSync(
            path.join(file.destination, foldername)
          );
          const resdata: any[] = [];
          for (var i = 0; i < items.length; i++) {
            const newPath = path.join(file.destination, foldername, items[i]);
            const fsData = fs.lstatSync(newPath);
            const isDirectory = fsData.isDirectory();
            const isFile = fsData.isFile();
            if (isDirectory) {
              const newItems: any[] = fs.readdirSync(newPath);
              for (var j = 0; j < newItems.length; j++) {
                const newSubPath = path.join(
                  file.destination,
                  foldername,
                  items[i],
                  newItems[j]
                );
                const fsSubData = fs.lstatSync(newSubPath);
                if (fsSubData.isFile()) {
                  const fileNameSub = `${moment().unix()}_${newItems[j]}`;
                  const year = (newItems[j].split("_")[0] || " ").trim();
                  const subject = (newItems[j].split("_")[1] || " ").trim();
                  resdata.push({
                    class: year,
                    subject,
                    status: "active",
                    createdBy: currentUser.id,
                    curriculumName: newItems[j],
                    file: newItems[j],
                    fileURL: `/${CurriculumFileStorageFolder}/${fileNameSub}`,
                    folderId,
                    country,
                    state,
                  });
                  try {
                    fs.renameSync(
                      newSubPath,
                      path.join(file.destination, fileNameSub)
                    );
                  } catch (error) {
                    reject(error);
                  }
                }
              }
            } else if (isFile) {
              const fileNameSub = `${moment().unix()}_${items[i]}`;
              const year = (items[i].split("_")[0] || " ").trim();
              const subject = (items[i].split("_")[1] || " ").trim();
              resdata.push({
                class: year,
                subject,
                status: "active",
                createdBy: currentUser.id,
                curriculumName: items[i],
                file: items[i],
                fileURL: `/${CurriculumFileStorageFolder}/${fileNameSub}`,
                folderId,
                country,
                state,
              });
              try {
                fs.renameSync(
                  newPath,
                  path.join(file.destination, fileNameSub)
                );
              } catch (error) {
                reject(error);
              }
            }
          }
          resolve(resdata);
        }
      );
    });
    await CurriculumModel.create(data);
    return res.status(200).send({
      message: "Folder data saved successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
