require("./firebase");

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
exports.scheduleThis = require("./lib/scheduler").scheduledFunction;

const app = express();

app.use(cors());

const eventRouter = require("./routes/events")
const groupRouter = require("./routes/groups");
const notifsRouter = require('./routes/notifications');

app.use("/events", eventRouter);
app.use("/groups", groupRouter);
app.use('/notifs', notifsRouter);

exports.app = functions.https.onRequest(app);
