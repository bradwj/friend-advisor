/**
 * @openapi
 * /profile/create:
 *   post:
 *     tags:
 *     - profile
 *     summary: By passing in the appropriate options, you can create a new profile.
 *     operationId: createProfile
 *     description: |
 *       Example Query: POST /profile/create?name=lexi&phone=+13212003905&likes=pineapples
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: name
 *       description: pass a name (REQUIRED)
 *       required: true
 *       type: string
 *     - in: query
 *       name: phone
 *       description: pass a phone number
 *       required: false
 *       type: string
 *     - in: query
 *       name: likes
 *       description: pass in likes
 *       required: false
 *       type: string
 *     - in: query
 *       name: dislikes
 *       description: pass in dislikes
 *       required: false
 *       type: string
 *     - in: query
 *       name: dob
 *       description: pass a date of birth
 *       required: false
 *       type: string
 *     responses:
 *       200:
 *         description: Returns json object with all profile fields.
 *       400:
 *         description: Name required, but not provided.
 *       500:
 *         description: Error adding document, or server error
 * /profile/edit:
 *   post:
 *     tags:
 *     - profile
 *     summary: By passing in the appropriate options, you can create a new profile.
 *     operationId: editProfile
 *     description: |
 *       Example Query: POST /profile/edit?name=lexi&phone=+13212003905&likes=pineapples
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: name
 *       description: pass a name (REQUIRED)
 *       required: true
 *       type: string
 *     - in: query
 *       name: phone
 *       description: pass a phone number
 *       required: false
 *       type: string
 *     - in: query
 *       name: likes
 *       description: pass in likes
 *       required: false
 *       type: string
 *     - in: query
 *       name: dislikes
 *       description: pass in dislikes
 *       required: false
 *       type: string
 *     - in: query
 *       name: dob
 *       description: pass a date of birth
 *       required: false
 *       type: string
 *     responses:
 *       200:
 *         description: Returns json object with all profile fields.
 *       400:
 *         description: Name required, but not provided.
 *       500:
 *         description: Error adding document, or server error
 */

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
