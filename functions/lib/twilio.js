require("dotenv").config();
const express = require("express");
const router = express.Router();

// Authentication information
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

function sendMessage(body, recipient) {
  client.messages
    .create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipient,
    })
    .then((message) => {
      console.log(message);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function sendBirthdayMessage(name, dob, recipient) {
  sendMessage(
    `${name}'s birthday is coming up on ${dob}!`,
    recipient
  );
}

export function sendEventMessage(eventName, date, recipient) {
  sendMessage(
    `${eventName} is coming up on ${date}!`,
    recipient
  );
}

// sendBirthdayMessage("Brad", "September 9th", process.env.BRADS_PHONE_NUMBER);
// sendEventMessage("Hacklahoma", "Februay 2nd, 2022", process.env.BRADS_PHONE_NUMBER);