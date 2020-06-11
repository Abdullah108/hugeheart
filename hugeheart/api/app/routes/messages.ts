import express from "express";
import { sendTextMessage, getAllMessages } from "../controllers";
import multer from "multer";
import { contactStorageFile } from "../common";
const upload: multer.Instance = multer({ storage: contactStorageFile });


const MessageRouter: express.Router = express.Router();

MessageRouter.get("/", getAllMessages);
MessageRouter.post("/", upload.single("file"), sendTextMessage);

export default MessageRouter;
