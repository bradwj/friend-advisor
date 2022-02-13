const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const db = admin.firestore();

router.post("/create", async (req, res) => {
  const { groupId, datetime, name, description, lat, long } = req.query;

  try {
    const event = {
      groupId,
      datetime: new Date(datetime),
      name,
      description,
      sentNotifications: {
        monthBefore: [],
        weekBefore: [],
        dayBefore: [],
        dayOf: [],
      },
    };
    if (lat && long) event.location = new admin.firestore.GeoPoint(Number(lat), Number(long));
    
    const docRef = await db.collection("events").add(event);
    console.log("Document written with ID:", docRef.id);
    res.status(200).send({ id: docRef.id, ...event });
  } catch (e) {
    res.status(400).send({ message: e.toString() });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const docRef = (await db.collection("events").doc(req.params.id).get()).data();
    res.status(200).send(docRef);
  } catch (e) {
    res.status(400).send({ message: e.toString() });
  }

});

module.exports = router;
