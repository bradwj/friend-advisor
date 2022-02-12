const {getFirestore} = require("firebase/firestore");
const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const db = admin.firestore();


router.post("/create", async (req, res) => {
    const {name} = req.query;
    try {
        const docRef = await db.collection("groups").add({
          name
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

})
router.post("/addmember", async (req, res) => {
    const {memberId} = req.query;

})

module.exports = router;
