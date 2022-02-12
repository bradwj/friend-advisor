const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const db = admin.firestore();


router.post("/create", async (req, res) => {
    const {name} = req.query;
    let members = ['//FIXME - ADD CALLING USER'];
    try {
        const docRef = await db.collection("groups").add({
          name, members
        });
        console.log("Document written with ID: ", docRef.id);
        res.send({msg: docRef.id});
      } catch (e) {
        console.error("Error adding document: ", e);
        res.status(400).send({message: e.toString()});
      }
})
router.post("/addmember", async (req, res) => {
    //const {memberId}; //FIXME - ADD CALLING USER
  
})

module.exports = router;
