import { ErrorMessage } from "../common";
import { Request, Response } from "express";
import slugify from "slugify";
import { CurriculumModel } from "../models";
import { CurriculumFileStorageFolder } from "../config";

/**
 *
 * @param req
 * @param res
 * @description Add new material
 */
export const addCurriculum = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, file } = req;
    let data = body;
    if (file && file.filename) {
      data.fileURL = `/${CurriculumFileStorageFolder}/${file.filename}`;
    }
    data.isActive = true;
    data.createdBy = req.currentUser.id;
    const material: any = new CurriculumModel(data);
    await material.save();
    return res.status(200).send({
      message: "Curriculum saved successfully.",
      data: material
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

export const getCurriculum = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query } = req;
    const {
      skip,
      limit,
      search,
      selectedYear,
      selectedSubject,
      folderId
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
          curriculumName: {
            $regex: new RegExp(slugify(search, "_"), "i")
          }
        },
        {
          curriculumName: {
            $regex: new RegExp(search, "i")
          }
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
    const curriculums = await CurriculumModel.find(condition)
      .populate("topic subTopic createdBy")
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 1000);
    const totalCurriculum = await CurriculumModel.countDocuments(condition);
    return res.status(200).send({
      message: "Curriculum's data fetched successfully.",
      data: curriculums,
      totalCurriculum
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
export const deleteCurriculum = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids } = body;
    await CurriculumModel.deleteMany({
      _id: {
        $in: ids
      }
    });

    return res.status(200).send({
      message: `${
        ids.length > 1 ? "Curriculums" : "Curriculum"
      } deleted successfully.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};
