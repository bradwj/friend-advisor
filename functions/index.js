require("./firebase");

const functions = require("firebase-functions");
const swaggerJsdoc = require("swagger-jsdoc");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
exports.scheduleThis = require("./lib/scheduler").scheduledFunction;

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Routes",
      version: "1.0.0"
    }
  },
  apis: ["./routes/events.js", "./routes/groups.js", "./routes/notifications.js"]
};

const openapiSpecification = swaggerJsdoc(options);
if (process.env.NODE_ENV !== "production") fs.writeFileSync("routesApi.json", JSON.stringify(openapiSpecification));

app.use(cors());
app.use(require("./lib/middleware/authenticate"));
app.use(require("./lib/middleware/cors"));

const eventRouter = require("./routes/events");
const groupRouter = require("./routes/groups");
const notifsRouter = require("./routes/notifications");

app.use("/events", eventRouter);
app.use("/groups", groupRouter);
app.use("/notifs", notifsRouter);

exports.app = functions.https.onRequest(app);
