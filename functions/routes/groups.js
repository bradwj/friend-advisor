const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const createjoincode = require('../lib/createjoincode.js');
const db = admin.firestore();


router.post("/create", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const { name, creatorId } = req.query;
  const group = {
    name,
    members: [creatorId],
    joinId: await generateGroupID()
  }
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

async function generateGroupID(){
  let genStatus = false;
  let count = 1;
  while (genStatus==false && count < 50)
  {
    count = count +1;
    let idToTry = createjoincode.generate(7);
    genStatus = await generateHelper(idToTry);
  }
  if (count >= 50) {return "Unable to Generate ID.";} //Break if too many iterations
  return genStatus;
}

async function generateHelper(idToTry){
  let group;

  try {
    group = await db.collection("groups").get();
    let fixed = [];
    group.forEach(elem => fixed.push(elem));

    for(let groupDoc of fixed) {
      let groupData = groupDoc.data();
      let joinId = groupData.joinId;
      console.log(joinId,"compared to",idToTry);
      if (joinId === idToTry)
      {
        return false;
      }
    }
  } catch (err) {
    console.log(err.message)
  }
  return idToTry;
}

module.exports = router;
