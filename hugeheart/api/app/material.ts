import { MaterialModel } from "./models";
import path from "path";
import fs from "fs";
import extract from "extract-zip";

export class MaterialUpload {
  constructor() {}

  async renameAndUpload() {
    /* const dir = fs.readdirSync(
      path.join(__dirname, "uploads", "material", "Ming - Mastery Courses")
    );
    console.log(dir);
    dir.map(d => {
      extract(
        `${path.join(
          __dirname,
          "uploads",
          "material",
          "Ming - Mastery Courses",
          d
        )}`,
        {
          dir: path.join(
            __dirname,
            "uploads",
            "material",
            "Ming - Mastery Courses"
          )
        },
        (err: any) => {
          console.log(err);
        }
      );
    }); */

    const materials = await MaterialModel.find({
      isDeleted: false,
    });
    let totalFiles = 0;
    materials.map((material: any) => {
      const newPath = path.join(
        __dirname,
        "uploads",
        "material",
        "Ming - Mastery Courses",
        material.materialName
      );
      const fileExists = fs.existsSync(newPath);
      const fileURLArray = material.fileURL.split("/");
      const fileName = path.join(
        __dirname,
        "uploads",
        "material",
        fileURLArray[fileURLArray.length - 1]
      );
      const notAlreadyExists = !fs.existsSync(fileName);
      if (fileExists && notAlreadyExists) {
        fs.renameSync(newPath, fileName);
        console.log("File Updated!");
        totalFiles++;
      }
    });
    console.log(totalFiles);
  }
}
