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
  try {
    const docRef = await db.collection("users").doc(req.user.uid);
    const updatedProfileData = {
      name: req.query.name,
      phone: req.query.phone,
      likes: req.query.likes,
      dislikes: req.query.dislikes,
      dob: req.query.dob, // FIXME: Call Brad's Function
      lastUpdated: Date.now()
    };
    docRef.update(updatedProfileData);
    console.log("Document written with ID: ", docRef.id);
    res.status(200).send({
      id: docRef.id,
      ...updatedProfileData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  };
});

module.exports = router;
