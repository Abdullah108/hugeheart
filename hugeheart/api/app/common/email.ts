import * as nodemailer from "nodemailer";
import { Request } from "express";
import { AppFrontendURL, AppURL } from "../config";
const fs = require("fs");
var path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "test.techcaves@gmail.com",
    pass: "gunj@123",
  },
});
/**
 * Available email templates
 */
const AvailiableTemplates = {
  MASTER_ADMIN_REGISTRATION: "MasterAdminRegister",
  MASTER_ADMIN_DETAILS_UPDATE: "MasterAdminDetailsUpdate",
  BRAND_AMBASSADOR_REFISTRATION: "BrandAmbassadorRegister",
  TEACHER_REGISTRATION: "TeacherRegister",
  ASIIGNTASK_TO_BRAND_AMB: "AssignTaskEmailToBrandAmb",
  MARK_ASSIGN_TASK: "MarkAssignTask",
  TRAINING_SCHEDULED: "TrainingSchedule",
  STUDENT_REFISTRATION: "StudentRegister",
  CLASS_REMINDER: "ClassReminderEmail",
};
/**
 *Class declaration
 */
class Email {
  cc: any;
  subject: any;
  to: any;
  host: any;
  body: any;
  webURL: any;
  adminURL: any;
  constructor(req?: Request) {
    this.body = "";
    this.subject = "";
    this.to = [];
    this.cc = "";
    const host =
      req && req.headers && req.headers.referer
        ? req.headers.referer.split("/")
        : [];
    this.webURL = AppFrontendURL;
    this.host = AppURL;
  }

  async setTemplate(templateName: string, replaceObject: any): Promise<any> {
    if (!templateName) {
      throw new Error("Please provide template name");
    }
    switch (templateName) {
      case AvailiableTemplates.MASTER_ADMIN_REGISTRATION:
        this.subject = "[HugeHeart]: Registration";
        break;
      case AvailiableTemplates.MASTER_ADMIN_DETAILS_UPDATE:
        this.subject = "[HugeHeart]: Details Update";
        break;
      case AvailiableTemplates.BRAND_AMBASSADOR_REFISTRATION:
      case AvailiableTemplates.TEACHER_REGISTRATION:
        this.subject = "[HugeHeart]: Registration";
        break;

      case AvailiableTemplates.ASIIGNTASK_TO_BRAND_AMB:
        this.subject = "[HugeHeart]: Assigned Task";
        break;
      case AvailiableTemplates.MARK_ASSIGN_TASK:
        this.subject = "[HugeHeart]: Task Marking";
        break;
      case AvailiableTemplates.TRAINING_SCHEDULED:
        this.subject = "[HugeHeart]: New training scheduled";
        break;
      case AvailiableTemplates.STUDENT_REFISTRATION:
        this.subject = "[HugeHeart]: Registration";
        break;
      default:
        break;
    }
    let header = fs.readFileSync(
      path.join(__dirname, `emailtemplates`, `header.html`),
      "utf8"
    );
    let footer = fs.readFileSync(
      path.join(__dirname, `emailtemplates`, `footer.html`),
      "utf8"
    );
    let content = `${header}${fs.readFileSync(
      path.join(__dirname, `emailtemplates`, `${templateName}.html`),
      "utf8"
    )}${footer}`;

    replaceObject = {
      ...replaceObject,
      webURL: this.webURL,
      adminURL: this.adminURL,
    };
    for (const key in replaceObject) {
      if (replaceObject.hasOwnProperty(key)) {
        const val = replaceObject[key];
        content = content.replace(new RegExp(`{${key}}`, "g"), val);
      }
    }
    this.body = content;
    return content;
  }

  setSubject(subject: string): Email {
    this.subject = subject;
    return this;
  }
  setBody(body: string): Email {
    this.body = body;
    return this;
  }
  setCC(cc: string): Email {
    this.cc = cc;
    return this;
  }
  async sendEmail(email: string): Promise<any> {
    if (!email) {
      throw new Error("Please provide email.");
    }
    const mailOption = {
      from: "HugeHeart Education <test.techcaves@gmail.com>",
      to: email,
      cc: this.cc,
      subject: this.subject,
      html: this.body,
    };
    let resp = transporter.sendMail(mailOption);
    return resp;
  }
}
/**
 *
 */
export { Email, AvailiableTemplates };
