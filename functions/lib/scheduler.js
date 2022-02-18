const { checkNotifications } = require("./notifications");
const functions = require("firebase-functions");

// noinspection JSUnusedLocalSymbols
exports.scheduledFunction = functions.pubsub.schedule("every 2 hours").onRun(async (context) => {
  console.log("This will be run every 2 hours.");
  await checkNotifications();
  return null;
});
