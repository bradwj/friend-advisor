// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

const serviceAccount = require("./service-account.json");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


module.exports = admin;
