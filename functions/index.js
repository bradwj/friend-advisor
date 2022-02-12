require("dotenv").config();
require("./firebase");

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true }));

const indexRouter = require("./routes/index");
const eventRouter = require("./routes/events")
const groupRouter = require("./routes/groups");

app.use("/", indexRouter);
app.use("/events", eventRouter);
app.use("/groups", groupRouter);

exports.app = functions.https.onRequest(app);
