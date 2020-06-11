import { ErrorMessage } from "../../common";
import { PrincipleModel } from "../../models";
import { Request, Response } from "express";

/**
 *
 */
const getPrinciple = async (req: Request, res: Response): Promise<any> => {
  try {
    const { query, currentUser } = req;
    const { skip, limit, search } = query;
    const { userRole } = currentUser;
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
    console.log("User Role");
    console.log(userRole);
    console.log("User Role");
    condition.userRole = userRole;
    const priciples = await PrincipleModel.find(condition)
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 1000);
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
export { getPrinciple };
