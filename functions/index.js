require("./firebase");

const functions = require("firebase-functions");
const admin = require("./firebase.js");
const firestoreDb = admin.firestore();
const swaggerJsdoc = require("swagger-jsdoc");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
exports.scheduleThis = require("./lib/scheduler").scheduledFunction;

const app = express();

firestoreDb.settings({ ignoreUndefinedProperties: true });

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Routes",
      version: "1.0.0"
    }
  },
  apis: [path.join(__dirname, "./routes/events.js"), path.join(__dirname, "./routes/groups.js"), path.join(__dirname, "./routes/notifications.js")]
};

const openapiSpecification = swaggerJsdoc(options);
if (process.env.NODE_ENV !== "production") fs.writeFileSync(path.join(__dirname, "routesApi.json"), JSON.stringify(openapiSpecification));

app.use(cors());
app.use(require("./lib/middleware/authenticate"));
app.use(require("./lib/middleware/cors"));

const eventRouter = require("./routes/events");
const groupRouter = require("./routes/groups");
const notifsRouter = require("./routes/notifications");
const profileRouter = require("./routes/profile");

app.use("/events", eventRouter);
app.use("/groups", groupRouter);
app.use("/notifs", notifsRouter);
app.use("/profile", profileRouter);

exports.app = functions.https.onRequest(app);
