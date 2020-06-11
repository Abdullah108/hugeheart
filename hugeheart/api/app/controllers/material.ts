import { Request, Response } from "express";
import { ErrorMessage } from "../common";
import { MaterialModel } from "../models";
import fs from "fs";
import { MaterialFileStoragePath, MaterialFilteStorageFolder } from "../config";
import * as mime from "mime-types";
import slugify from "slugify";
import { fileURLToPath } from "url";

/**
 *
 * @param req
 * @param res
 * @description Add new material
 */
const addMaterial = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, file } = req;
    let data = body;
    const { class: year, subject, topicName } = data;
    let filename = "";
    // if (file && file.filename) {
    //   filename = `${slugify(
    //     `Year ${year} ${subject} ${topicName}`,
    //     "_"
    //   )}.${mime.extension(file.mimetype)}`;
    //   fs.renameSync(
    //     `${MaterialFileStoragePath}/${file.filename}`,
    //     `${MaterialFileStoragePath}/${filename}`
    //   );
    //   data["fileURL"] = `/${MaterialFilteStorageFolder}/${filename}`;
    // }

    if (file && file.filename) {
      data.fileURL = `/${MaterialFilteStorageFolder}/${file.filename}`; // remove this line if file name need to rename
      data.materialName = file.filename.substr(
        0,
        file.filename.lastIndexOf(".")
      );
    }
    data.status =
      req.currentUser && req.currentUser.userRole == "superadmin"
        ? "active"
        : "pending";
    data.createdBy = req.currentUser.id;
    let material = new MaterialModel(data);
    await material.save();
    return res.status(200).send({
      message: "Material saved successfully.",
      data: material
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

/**
 *
 * @param req
 * @param res
 * @description Get all active Materials as per pagination
 */
const getMaterial = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const {
      skip,
      limit,
      search,
      selectedYear,
      selectedSubject,
      folderId,
      topic
    } = query;
    let condition: any = {};

    condition["$or"] = [
      {
        isDeleted: {
          $eq: false
        }
      },
      {
        isDeleted: {
          $exists: false
        }
      }
    ];
    if (search) {
      condition["$or"] = [
        {
          materialName: {
            $regex: new RegExp(slugify(search, "_"), "i")
          }
        },
        {
          materialName: {
            $regex: new RegExp(search, "i")
          }
        }
      ];
    }
    if (topic) {
      condition["$or"] = [
        {
          materialName: {
            $regex: new RegExp(slugify(topic.split("-")[0], "_"), "i")
          }
        },
        {
          materialName: {
            $regex: new RegExp(topic.split("-")[0], "i")
          }
        },
        {
          topic: topic.split("-")[1]
        }
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
      totalMaterial
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

/**
 *
 * @param req
 * @param res
 * @description soft delete material
 */
const deleteMaterial = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids } = body;
    await MaterialModel.deleteMany({
      _id: {
        $in: ids
      }
    });
    try {
      let materialFiles: any[] = await MaterialModel.find({
        _id: { $in: ids }
      });

      for (let index = 0; index < materialFiles.length; index++) {
        let materialName = materialFiles[index].fileURL.split("/").pop();
        if (fs.existsSync(`${MaterialFileStoragePath}/${materialName}`)) {
          fs.unlinkSync(`${MaterialFileStoragePath}/${materialName}`);
        }
      }
    } catch (error) {}

    return res.status(200).send({
      message: `${
        ids.length > 1 ? "Materials" : "Material"
      } deleted successfully.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

/**
 *
 * @param req
 * @param res
 * @description Get single material details by id
 */
const getMaterialDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;

    const material = await MaterialModel.findOne({ _id: id });

    return res.status(200).send({
      message: "Material's details fetched successfully.",
      data: material
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

/**
 *
 * @param req
 * @param res
 * * @description Update material details and delete old file
 */
const updateMaterial = async (req: Request, res: Response): Promise<any> => {
  try {
    const { params, body, file } = req;
    const { id } = params;
    let data = body;

    if (file && file.filename) {
      data.fileURL = `/${MaterialFilteStorageFolder}/${file.filename}`;
      data.materialName = file.filename.substr(
        0,
        file.filename.lastIndexOf(".")
      );

      let materialFiles: any = await MaterialModel.findOne(
        { _id: id },
        { fileURL: 1 }
      );

      let oldMaterialFileName = materialFiles.fileURL.split("/").pop();

      if (file.filename != oldMaterialFileName) {
        if (
          fs.existsSync(`${MaterialFileStoragePath}/${oldMaterialFileName}`)
        ) {
          fs.unlinkSync(`${MaterialFileStoragePath}/${oldMaterialFileName}`);
        }
      }
    }
    await MaterialModel.updateOne(
      {
        _id: id
      },
      {
        $set: data
      }
    );

    return res.status(200).send({
      message: "Material's updated saved successfully."
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

/**
 *
 */
export {
  addMaterial,
  getMaterial,
  deleteMaterial,
  getMaterialDetails,
  updateMaterial
};
