require("./firebase");

const functions = require("firebase-functions");
const swaggerJsdoc = require('swagger-jsdoc');
const express = require("express");
const cors = require("cors");
const fs = require("fs");
exports.scheduleThis = require("./lib/scheduler").scheduledFunction;

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Routes',
      version: '1.0.0',
    },
  },
  apis: ['./routes*.js'], 
};

const openapiSpecification = swaggerJsdoc(options);
fs.writeFileSync("routesApi", JSON.stringify(openapiSpecification))

app.use(cors());

const eventRouter = require("./routes/events");
const groupRouter = require("./routes/groups");
const notifsRouter = require("./routes/notifications");

app.use("/events", eventRouter);
app.use("/groups", groupRouter);
app.use("/notifs", notifsRouter);

exports.app = functions.https.onRequest(app);
