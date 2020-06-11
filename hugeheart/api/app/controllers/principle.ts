import { Request, Response } from "express";
import { ErrorMessage, Email, AvailiableTemplates } from "../common";
import { PrincipleModel, UserModel } from "../models";
import { Document, Types } from "mongoose";
import { log } from "util";
import { AppURL } from "../config";

/**
 *
 */
const addPrinciple = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    let { userId, role, question, answer, documents, type } = body;
    let filename: any = req.file;
    const data: any = {
      //question: question,
      answer: answer,
      userId: userId || [],
      userRole: role.split(","),
      createdBy: currentUser && currentUser.id,
      type
    };
    if (filename) {
      data["documents"] = `${filename.filename}`;
    }

    const principle = new PrincipleModel(data);
    const result = await principle.save();
    return res.status(200).json({
      responseCode: 200,
      data: result,
      success: true
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
const getPrinciple = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query } = req;
    const { skip, limit, search, selectRole } = query;
    let condition: any = {
      isDeleted: false
    };
    if (search) {
      condition["$or"] = [
        {
          question: {
            $regex: new RegExp(search, "i")
          }
        },
        {
          answer: {
            $regex: new RegExp(search, "i")
          }
        }
      ];
    }
    if (selectRole) {
      condition.userRole = selectRole;
    }
    const priciples = await PrincipleModel.find(condition)
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 25);
    const totalPrinciple = await PrincipleModel.countDocuments(condition);
    return res.status(200).send({
      message: "Principle fetched successfully.",
      data: priciples,
      totalPrinciple
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
const getPrincipleDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { params } = req;
    const { id } = params;
    const principle = await PrincipleModel.findOne({
      _id: id,
      isDeleted: false
    });
    if (!principle) {
      return res.status(404).send({
        message: "Principle doesn't exits."
      });
    }
    return res.status(200).send({
      message: "Principle details fetched successfully.",
      data: principle
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
const updatePrinciple = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser, params } = req;
    const { id } = params;
    let filename: any = req.file;
    const data: any = {
      answer: body.answer,
      userRole: body.role.split(","),
      type: body.type
    };
    if (filename) {
      data["documents"] = `${filename.filename}`;
    }
    const result = await PrincipleModel.updateOne(
      {
        _id: Types.ObjectId(id)
      },
      {
        $set: data
      }
    );
    return res.status(200).send({
      message: "Principle details updated successfully.",
      data: result
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
const deletePrinciple = async (req: Request, res: Response): Promise<any> => {
  try {
    const { body, currentUser } = req;
    const { id } = currentUser || {};
    const { ids } = body;
    const resp = await PrincipleModel.deleteMany({
      _id: {
        $in: ids
      }
    });
    return res.status(200).send({
      data: resp,
      message: `${
        ids && ids.length > 1 ? "Principles" : "Principle"
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
 * Get principle according to the user role
 */

const getPrincipleUserRole = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { currentUser } = req;
    const { userRole } = currentUser;
    const principle = await PrincipleModel.find({
      userRole: userRole,
      isDeleted: false
    });
    if (!principle) {
      return res.status(404).send({
        message: "Principle doesn't exits."
      });
    }
    return res.status(200).send({
      message: "Principle details fetched successfully.",
      data: principle
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE
    });
  }
};

export {
  addPrinciple,
  getPrinciple,
  getPrincipleDetails,
  updatePrinciple,
  deletePrinciple,
  getPrincipleUserRole
};
