const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const db = admin.firestore();

router.post("/create", async (req, res) => {
  const { groupId, datetime, name, description, lat, long } = req.query;

  try {
    const docRef = await addDoc(collection(db, "events"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

module.exports = router;
