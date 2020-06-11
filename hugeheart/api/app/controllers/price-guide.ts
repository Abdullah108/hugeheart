import { Request, Response } from "express";
import { ErrorMessage } from "../common";
import { PriceGuideModel } from "../models";
/**
 *
 */
export const getPriceGuide = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const priceGuides = await PriceGuideModel.aggregate([
      {
        $group: {
          _id: "$group",
          price: {
            $first: "$price",
          },
        },
      },
    ]);
    return res.status(200).send({
      message: "Price guide fetched successfully.",
      data: priceGuides,
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
export const updatePriceGuide = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { body } = req;
    const keys = Object.keys(body);
    const dataToSave: any[] = [];
    keys.forEach((k) => {
      const kArray = k.split("-");
      const min = parseInt(kArray[0]);
      const max = parseInt(kArray[1]);
      for (let index = min; index <= max; index++) {
        dataToSave.push({
          class: index,
          price: body[k],
          group: k,
        });
      }
    });
    await PriceGuideModel.deleteMany({});
    await PriceGuideModel.create(dataToSave);
    return res.status(200).send({
      message: "Price details updated successfully.",
      dataToSave,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: ErrorMessage.DEFAULT_EROR_MESSAGE,
    });
  }
};
