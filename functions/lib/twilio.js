require("dotenv").config();
const express = require("express");
const router = express.Router();

// Authentication information
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

function sendMessage(messageBody, recipient) {
  let resp;
  client.messages
    .create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipient
    })
    .then((message) => {
      console.log(message);
      resp = message;
    })
    .done();
  return resp;
}

function sendBirthdayMessage(name, dob, recipient) {
  try {
    const resp = sendMessage(
      `${name}'s birthday is coming up on ${dob}!`,
      recipient
    );
    console.log(resp);
    return resp;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function sendEventMessage(eventName, date, recipient) {
  try {
    const resp = await sendMessage(
      `${eventName} is coming up on ${date}!`,
      recipient
    )
    console.log(resp);
    return resp;
  } catch (e) {
    console.log('Error', e);
    return e;
  }
}

// sendBirthdayMessage("Brad", "September 9th", process.env.BRADS_PHONE_NUMBER);
sendEventMessage("Hacklahoma", "Februay 2nd, 2022", process.env.BRADS_PHONE_NUMBER);

// exports.sendBirthdayMessage = sendBirthdayMessage;
