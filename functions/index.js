// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
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