import { Request, Response } from "express";
import {
  TeacherMaterialAssignModel,
  MaterialModel,
  TeacherCurriculumAssignModel,
} from "../../models";
import { ErrorMessage } from "../../common";
import { Types } from "mongoose";
import slugify from "slugify";
import * as mime from "mime-types";
import fs from "fs";
import {
  MaterialFileStoragePath,
  MaterialFilteStorageFolder,
} from "../../config";
import moment from "moment";
import { addNotifications } from "../notification";
import { getAdminIds } from "../user";
/**
 *
 */
const getAssignedMaterials = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { currentUser, query } = req;
    const { id } = currentUser;
    const { search, type } = query;
    let condition: any = {
      teacherId: Types.ObjectId(id),
      assignmentStatus: "assigned",
    };
    if (search) {
      condition["$or"] = [
        {
          "folderId.folderName": {
            $regex: new RegExp(search, "i"),
          },
        },
      ];
    }
    let result: any[] = [];
    if (type) {
      result = await TeacherCurriculumAssignModel.aggregate([
        {
          $lookup: {
            from: "folders",
            localField: "folderId",
            foreignField: "_id",
            as: "folderId",
          },
        },
        {
          $unwind: "$folderId",
        },
        {
          $match: condition,
        },
      ]);
    } else {
      result = await TeacherMaterialAssignModel.aggregate([
        {
          $lookup: {
            from: "folders",
            localField: "folderId",
            foreignField: "_id",
            as: "folderId",
          },
        },
        {
          $unwind: "$folderId",
        },
        {
          $match: condition,
        },
      ]);
    }

    return res.status(200).send({
      message: "Assigned materials to teacher fetched successfully.",
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
const requestMaterial = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, file, currentUser } = req;
    delete body._id;
    delete body.createdAt;
    let data: any = body;
    const { materialName } = data;
    let filename = "";
    filename = `${slugify(
      `${materialName.split(".")[0]} ${currentUser.fullName} ${moment().format(
        "DD-MM-YYYY"
      )}`,
      "_"
    )}.${mime.extension(file.mimetype)}`;
    fs.renameSync(
      `${MaterialFileStoragePath}/${file.filename}`,
      `${MaterialFileStoragePath}/${filename}`
    );
    data["fileURL"] = `/${MaterialFilteStorageFolder}/${filename}`;
    data.file = file.filename;
    data.materialName = filename;
    data.status = "pending";
    data.createdBy = currentUser.id;
    let material = new MaterialModel(data);
    await material.save();
    await addNotifications(
      req,
      res,
      "New material added",
      `${currentUser.fullName} has request to update material for ${materialName}`,
      currentUser.id,
      await getAdminIds(),
      `/material`
    );
    return res.status(200).send({
      message: "Material saved successfully.",
      data: material,
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
 * @param req
 * @param res
 * @description Get all active Materials as per pagination
 */
const getFoldersMaterials = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, params } = req;
    const { folderId } = params;
    const { skip, limit, search, selectedYear, selectedSubject, topic } = query;
    let condition: any = {};

    condition["$or"] = [
      {
        isDeleted: {
          $eq: false,
        },
      },
      {
        isDeleted: {
          $exists: false,
        },
      },
    ];
    if (search) {
      condition["$or"] = [
        {
          materialName: {
            $regex: new RegExp(slugify(search, "_"), "i"),
          },
        },
        {
          materialName: {
            $regex: new RegExp(search, "i"),
          },
        },
      ];
    }
    if (topic) {
      condition["$or"] = [
        {
          materialName: {
            $regex: new RegExp(slugify(topic.split("-")[0], "_"), "i"),
          },
        },
        {
          materialName: {
            $regex: new RegExp(topic.split("-")[0], "i"),
          },
        },
        {
          topic: topic.split("-")[1],
        },
      ];
    }
    if (selectedSubject) {
      condition["subject"] = selectedSubject;
    }
    if (selectedYear) {
      condition["class"] = selectedYear;
    }
    condition["folderId"] = folderId;
    const materials = await MaterialModel.find(condition)
      .populate("topic subTopic createdBy")
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 1000);
    const totalMaterial = await MaterialModel.countDocuments(condition);
    return res.status(200).send({
      message: "Material's data fetched successfully.",
      data: materials,
      totalMaterial,
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
export { getAssignedMaterials, requestMaterial, getFoldersMaterials };
