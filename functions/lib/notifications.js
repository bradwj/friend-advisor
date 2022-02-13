const admin = require("../firebase.js");
const db = admin.firestore();

// Twilio authentication
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

// Goes through all events and sends notifications to all members of the group if it is time to do so
export async function checkNotifications() {
  console.log("Checking for notifications...");

  const groupsRef = db.collection("groups");
  const usersRef = db.collection("users");
  const eventsRef = db.collection("events");

  const eventSnapshot = await eventsRef.get(); // Obtain all events
  if (eventSnapshot.empty) {
    console.log("No events found.");
    return;
  }

  eventSnapshot.forEach(async (eventDoc) => {
    // Loop through all events
    const groupId = eventDoc.groupId;
    const groupData = (await groupsRef.doc(groupId).get()).data();
    const memberIds = groupData.members;
    const sentNotifications = eventDoc.sentNotifications;

    const currentDate = new Date();
    const hourDifference = (eventDoc.date - currentDate) / (1000 * 60 * 60);

    if (hourDifference > 0) {
      if (hourDifference <= 24) {
        // Send user a message on the DAY OF the event if they haven't already been sent a notification
        memberIds.forEach(async (memberId) => {
          const memberData = (await usersRef.doc(memberId).get()).data();
          if (!sentNotifications.dayOf.includes(memberId)) {
            sendNotificationDayOf(
              eventDoc.name,
              eventDoc.description,
              eventDoc.date,
              memberData.phone
            );
            sentNotifications.dayOf.push(memberId);
          }
        });
      }
    } else if (hourDifference <= 48) {
      // Send user a message on the DAY BEFORE the event if they haven't already been sent a notification
      memberIds.forEach(async (memberId) => {
        const memberData = (await usersRef.doc(memberId).get()).data();
        if (!sentNotifications.dayBefore.includes(memberId)) {
          sendNotificationDayBefore(
            eventDoc.name,
            eventDoc.description,
            eventDoc.date,
            memberData.phone
          );
          sentNotifications.dayBefore.push(memberId);
        }
      });
    } else if (hourDifference <= (24 * 7)) {
      // Send user a message on the WEEK BEFORE the event if they haven't already been sent a notification
      memberIds.forEach(async (memberId) => {
        const memberData = (await usersRef.doc(memberId).get()).data();
        if (!sentNotifications.weekBefore.includes(memberId)) {
          sendNotificationWeekBefore(
            eventDoc.name,
            eventDoc.description,
            eventDoc.date,
            memberData.phone
          );
          sentNotifications.weekBefore.push(memberId);
        }
      });
    } else if (hourDifference <= (24 * 30)) {
      // Send user a message on the MONTH BEFORE the event if they haven't already been sent a notification
      memberIds.forEach(async (memberId) => {
        const memberData = (await usersRef.doc(memberId).get()).data();
        if (!sentNotifications.monthBefore.includes(memberId)) {
          sendNotificationMonthBefore(
            eventDoc.name,
            eventDoc.description,
            eventDoc.date,
            memberData.phone
          );
          sentNotifications.monthBefore.push(memberId);
        }
      });
    }
  });
}

// Send message with messageBody to recipient
function sendMessage(messageBody, recipient) {
  console.log(`Message: ${messageBody} send to ${recipient}`);
  client.messages
    .create({
      body: messageBody,
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

function sendNotificationDayOf(eventName, description, date, recipient) {
  sendMessage(
    `Reminder: ${eventName} is today!\nDescription: ${description}`,
    recipient
  );
}

function sendNotificationDayBefore(eventName, description, date, recipient) {
  sendMessage(
    `Reminder: ${eventName} is tomorrow, ${date}!\nDescription: ${description}`,
    recipient
  );
}

function sendNotificationWeekBefore(eventName, description, date, recipient) {
  sendMessage(
    `Reminder: ${eventName} is in a week on ${date}!\nDescription: ${description}`,
    recipient
  );
}
function sendNotificationMonthBefore(eventName, description, date, recipient) {
  sendMessage(
    `Reminder: ${eventName} on ${date} is almost a month away!\nDescription: ${description}`,
    recipient
  );
}
