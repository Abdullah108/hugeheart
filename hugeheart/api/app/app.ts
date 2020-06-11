require("dotenv").config();
import express, { Request, Response } from "express";
import * as bodyParser from "body-parser";
import router from "./routes";
import masterRouter from "./routes/master-admin";
import MobileAppRouter from "./routes/mobile";
import { connect } from "mongoose";
import { UserSeeder } from "./seeders/users";
import cors from "cors";
import { MongoDBURL, isDevMode } from "./config";
import path from "path";
import { ValidateToken } from "./common";
import http from "http";
import { initializeCrons } from "./cron";
import * as faker from 'faker';
//var faker = require("faker");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
// Create a new express application instance
const app: express.Application = express();

connect(MongoDBURL, {
  replicaSet: "rsNameHere",
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
})
  .then(() => {
    console.log("Database connected successfully.");
    UserSeeder();
    initializeCrons();
  })
  .catch((err) => {
    console.log(`Error connecting db`);
    console.log(err);
  });

if (isDevMode) {
  app.use(cors());
}
/**
 *
 **/
app.use(
  "/uploads/material/:file",
  ValidateToken,
  async (req: Request, res: Response): Promise<any> => {
    const { params, currentUser, query } = req;
    const { folderId } = query;
    const { file } = params;
    const { userRole, id } = currentUser;
    switch (userRole) {
      case "teacher":
        return res.sendFile(path.join(__dirname, "uploads", "material", file));
      case "superadmin":
        return res.sendFile(path.join(__dirname, "uploads", "material", file));
      default:
        return res.sendFile(path.join(__dirname, "uploads", "no-access.jpg"));
    }
  }
);

app.use("/", express.static(path.join(__dirname, "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/superadmin", express.static(path.join(__dirname, "superadmin")));
// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json({ limit: "1024mb" }));

// path for API
app.use("/api/v1", router);
app.use("/api/v2", masterRouter);
app.use("/api/v3", MobileAppRouter);

/*
Generate an Access Token for a chat application user - it generates a random
username for the client requesting a token, and takes a device ID as a query
parameter.
*/
app.get("/token", function (request, response) {
  var identity = faker.name.findName();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token
  token.identity = identity;

  //grant the access token Twilio Video capabilities
  var grant = new VideoGrant();
  // grant.configurationProfileSid = process.env.TWILIO_CONFIGURATION_SID;
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});


// rooute for home page
app.get("/", (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/superadmin", (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, "superadmin", "index.html"));
});
app.get("/superadmin/*", (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, "superadmin", "index.html"));
});
app.get("/*", (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, "frontend", "index.html"));
});
const port: number = Number(process.env.PORT) || 8000;

const server = http.createServer(app);
server.setTimeout(0, () => {
  console.log("request timed out");
});

server.listen(port, () => {
  console.log(`Muhammad! App listening on port ${port}!`);
});
