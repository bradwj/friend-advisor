require("dotenv").config();
require("./firebase");

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
exports.scheduleThis = require("./lib/scheduler").scheduledFunction;

const app = express();

app.use(cors({ origin: true }));

const eventRouter = require("./routes/events")
const groupRouter = require("./routes/groups");

app.use("/events", eventRouter);
app.use("/groups", groupRouter);

exports.app = functions.https.onRequest(app);
