require("dotenv").config();
const express = require("express");
const router = express.Router();

// Authentication information
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

async function sendMessage(body, recipient) {
  client.messages
    .create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipient
    })
    .then((message) => {
      return message.id;
    })
    .done();
}

async function sendBirthdayMessage(name, dob, recipient) {
  try {
    await sendMessage(
      `${name}'s birthday is coming up on ${dob}!`,
      process.env.BRADS_PHONE_NUMBER
    ).then((resp) => {
      // console.log(resp);
      return resp;
    });
  } catch (e) {
    // console.log(e);
    return e;
  }
}

console.log ( sendBirthdayMessage("Brad", "September 9th", process.env.BRADS_PHONE_NUMBER) );

// exports.sendBirthdayMessage = sendBirthdayMessage;
