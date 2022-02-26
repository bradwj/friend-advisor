const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const db = admin.firestore();

router.post("/create", async (req, res) => {
  const { name, phone, likes, dislikes, dob } = req.query;
  if (!name || name === "") {
    console.error("No name specified.");
    return res.status(400).send({ message: "No name was specified, but it is a required argument." });
  }
  // TODO: check if phone number is valid
  const newProfile = {
    name: name,
    phone: phone || "",
    likes: likes || "",
    dislikes: dislikes || "",
    dob: isNaN(new Date(dob)) || (typeof dob !== "string") ? "" : dob,
    userId: req.user.uid,
    lastUpdated: Date.now()
  };
  try {
    await db.collection("users").doc(req.user.uid).set(newProfile);
    console.log("User document updated.");
    res.status(200).send(newProfile);
  } catch (err) {
    console.error("Error adding document: ", err);
    res.status(500).send({ message: err.toString() });
  }
});

router.patch("/edit", async (req, res) => {
  const { name, phone, likes, dislikes, dob } = req.query;
  if (!name || name === "") {
    console.error("No name specified.");
    return res.status(400).send({ message: "No name was specified, but it is a required argument." });
  }
  try {
    const docRef = await db.collection("users").doc(req.user.uid);
    const updatedProfileData = {
      name: name,
      phone: phone || "",
      likes: likes || "",
      dislikes: dislikes || "",
      dob: isNaN(new Date(dob)) || (typeof dob !== "string") ? "" : dob,
      userId: req.user.uid,
      lastUpdated: Date.now()
    };
    docRef.update(updatedProfileData);
    console.log("Document written with ID: ", docRef.id);
    res.status(200).send(updatedProfileData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  };
});

module.exports = router;