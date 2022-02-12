require("dotenv").config();
const express = require("express");
const router = express.Router();

// Authentication information
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

router.get("/send", async (req, res) => {
  client.messages
    .create({
      body: "Hi there",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.BRADS_PHONE_NUMBER,
    })
    .then((message) => console.log(message.sid))
    .done();
});

module.exports = router;