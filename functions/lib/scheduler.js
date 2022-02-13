const {searchDates} = require ('./compareDates');
const functions = require('firebase-functions');

exports.scheduledFunction = functions.pubsub.schedule('every 2 hours').onRun((context) => {
    console.log('This will be run every 2 hours!');
    searchDates(48);
    return null;
  });