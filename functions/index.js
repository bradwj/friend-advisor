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
const twilio = require("twilio");

app.use(cors({ origin: true }));


// Authenticate twilio
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

app.get('/send', (req, res) => {
  client.messages
    .create({
      body: "Hi there",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.BRADS_PHONE_NUMBER
    })
    .then((message) => console.log(message.sid))
    .done();
});

exports.app = functions.https.onRequest(app);