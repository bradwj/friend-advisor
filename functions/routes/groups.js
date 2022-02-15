const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
// import {generate} from '../lib/createjoincode';
const db = admin.firestore();

router.post("/create", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const { name, creatorId } = req.query;
  const group = {
    name,
    members: [creatorId]
    // ,
    // id: generate(6)
  };
  
  try {
    const docRef = await db.collection("groups").add(group);
    console.log("Document written with ID: ", docRef.id);
    res.status(200).send({
      id: docRef.id,
      ...group
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(400).send({ message: e.toString() });
  }
});

//Get a specific group
router.get("/find", findGroup, async (req, res) => {
  res.status(200).json(res.group);
})

router.delete("/delete", findGroup, async(req, res) => {
  try {
    const deleteDoc = await res.group.delete();
    res.status(200).json({message: "Group has been deleted successfully!"});
  } catch (err)
  {
    res.status(500).json({message: err.message});
  }
  
})

router.patch("/edit", findGroup, async(req, res) => {
  //FIXME
})

async function findGroup(req, res, next) {
  let group;
  const { id } = req.query;
  if (id == null)
  {
    try {
      group = await db.collection("groups").get();
    } catch (err) {
      res.status(500).json({message: "Server error: Cannot list groups"})
    }
    res.group = group;
  }
  else
  {
    try {
      group = await db.collection("groups").doc(id);
      const doc = await group.get();
      if (group == null || !doc.exists) {
          return res.status(404).json({message: "Cannot find group."}) //status 404 means you cannot find something
      }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.group = group;
  }
  next();
}

module.exports = router;
