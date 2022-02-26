require("dotenv").config({ path: require("find-config")(".env") });
const admin = require("../firebase.js");
const db = admin.firestore();

// Twilio authentication
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

// Goes through all events and sends notifications to all members of the group if it is time to do so
exports.checkNotifications = async function checkNotifications () {
  console.log("Checking for notifications...");

  const groupsRef = db.collection("groups");
  const usersRef = db.collection("users");
  const eventsRef = db.collection("events");

  try {
    const eventSnapshot = await eventsRef.get(); // Obtain all events
    if (eventSnapshot.empty) {
      console.log("No events found.");
      return;
    }
    const events = [];
    eventSnapshot.forEach(event => events.push(event));
    for (const eventDoc of events) {
      // Loop through all events
      try {
        const eventData = eventDoc.data();
        const groupId = eventData.groupId;

        const groupData = (await groupsRef.doc(groupId).get()).data();
        console.log(groupData);

        const memberIds = groupData.members;
        const sentNotifications = eventData.sentNotifications;

        const currentDate = new Date();
        const eventDate = eventData.datetime.toDate();
        const eventDateString = eventDate.toLocaleDateString();
        const hourDifference = (eventDate - currentDate) / (1000 * 60 * 60);

        let updated = false;
        if (hourDifference > 0) {
          if (hourDifference <= 24) {
            // Send user a message on the DAY OF the event if they haven't already been sent a notification
            for (const memberId of memberIds) {
              const memberData = (await usersRef.doc(memberId).get()).data();
              if (!sentNotifications.dayOf.includes(memberId)) {
                sendNotificationDayOf(
                    eventData.name,
                    eventData.description,
                    eventDateString,
                    memberData.phone
                );
                sentNotifications.dayOf.push(memberId);
                updated = true;
              }
            }
          } else if (hourDifference <= 48) {
            // Send user a message on the DAY BEFORE the event if they haven't already been sent a notification
            for (const memberId of memberIds) {
              const memberData = (await usersRef.doc(memberId).get()).data();
              if (!sentNotifications.dayBefore.includes(memberId)) {
                sendNotificationDayBefore(
                    eventData.name,
                    eventData.description,
                    eventDateString,
                    memberData.phone
                );
                sentNotifications.dayBefore.push(memberId);
                updated = true;
              }
            }
          } else if (hourDifference <= 24 * 7) {
            // Send user a message on the WEEK BEFORE the event if they haven't already been sent a notification
            for (const memberId of memberIds) {
              const memberData = (await usersRef.doc(memberId).get()).data();
              if (!sentNotifications.weekBefore.includes(memberId)) {
                sendNotificationWeekBefore(
                    eventData.name,
                    eventData.description,
                    eventDateString,
                    memberData.phone
                );
                sentNotifications.weekBefore.push(memberId);
                updated = true;
              }
            }
          } else if (hourDifference <= 24 * 30) {
            // Send user a message on the MONTH BEFORE the event if they haven't already been sent a notification
            for (const memberId of memberIds) {
              const memberData = (await usersRef.doc(memberId).get()).data();
              if (!sentNotifications.monthBefore.includes(memberId)) {
                sendNotificationMonthBefore(
                    eventData.name,
                    eventData.description,
                    eventDateString,
                    memberData.phone
                );
                sentNotifications.monthBefore.push(memberId);
                updated = true;
              }
            }
          }
        } else {
          console.log("event ", eventData.name, "has already happened");
        }
        // Update event document
        if (updated) {
          await eventsRef.doc(eventDoc.id).set({
            sentNotifications
          }, { merge: true });
        }
      } catch (e) {
        console.error(e);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

// Send message with messageBody to recipient
function sendMessage (messageBody, recipient) {
  client.messages
    .create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipient
    })
    .then((message) => {
      console.log(message);
    })
    .catch((error) => {
      console.error(error);
    });
}

function sendNotificationDayOf (eventName, description, date, recipient) {
  sendMessage(
    `Reminder: Your event "${eventName}" is today!\nDescription: ${description}`,
    recipient
  );
}

function sendNotificationDayBefore (eventName, description, date, recipient) {
  sendMessage(
    `Reminder: Your event "${eventName}" is tomorrow, ${date}!\nDescription: ${description}`,
    recipient
  );
}

function sendNotificationWeekBefore (eventName, description, date, recipient) {
  sendMessage(
    `Reminder: Your event "${eventName}" is in less than a week on ${date}!\nDescription: ${description}`,
    recipient
  );
}

function sendNotificationMonthBefore (eventName, description, date, recipient) {
  sendMessage(
    `Reminder: Your event "${eventName}" on ${date} is less than a month away!\nDescription: ${description}`,
    recipient
  );
}
