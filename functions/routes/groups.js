const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const db = admin.firestore();


router.post("/create", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const { name, creatorId } = req.query;
  const group = {
    name,
    members: [creatorId]
  }
  try {
    const docRef = await db.collection("groups").add(group);
    console.log("Document written with ID: ", docRef.id);
    res.send({
      id: docRef.id,
      ...group
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(400).send({ message: e.toString() });
  }
});

module.exports = router;
