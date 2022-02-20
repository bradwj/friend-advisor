const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const db = admin.firestore();

router.post("/create", async (req, res) => {
  let { name, phone, likes, dislikes, dob } = req.query;
  if (name === undefined || name === null) {
    name = "No Name Provided";
  }
  if (phone === undefined || phone === null) {
    phone = "";
  }
  if (likes === undefined || likes === null) {
    likes = "";
  }
  if (dislikes === undefined || dislikes === null) {
    dislikes = "";
  }
  if (dob === undefined || dob === null) {
    dob = "";
  }
  const newProfile = {
    name,
    phone,
    likes,
    dislikes,
    dob,
    userId: req.user.uid,
    lastUpdated: Date.now()
  };
  try {
    const docRef = await db.collection("users").doc(req.user.uid).set(newProfile);
    console.log("Document written with ID: ", docRef.id);
    res.status(200).send({
      id: docRef.id,
      ...newProfile
    });
  } catch (err) {
    console.error("Error adding document: ", err);
    res.status(500).send({ message: err.toString() });
  }
});

router.patch("/edit", async (req, res) => {
  // TO-DO
});

module.exports = router;
