const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const createjoincode = require("../lib/createjoincode.js");
const db = admin.firestore();

router.post("/create", async (req, res) => { //Used to Create Group
  res.set("Access-Control-Allow-Origin", "*");
  const { name, creatorId } = req.query;
  const group = {
    name,
    members: [creatorId],
    joinId: await generateGroupID()
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

// Get a specific group
router.get("/find/allData", findGroup, async (req, res) => {
  try {
    const doc = await res.group.get();
    if (doc.exists)
    {
      res.status(200).json({data: doc.data()});
    }
    else
    {
      res.status(404).json({message: "Group does not exist."})
    }
  } catch (err)
  {
    res.status(500).json({ message: err.message });
  }
  res.status(200).json(res.group);
});

router.get("/find/joinId", findGroup, async(req, res) => {
  try {
    const doc = await res.group.get();
    if (doc.exists)
    {
      res.status(200).json({joinId: doc.data().joinId});
    }
    else
    {
      res.status(404).json({message: "Group does not exist."})
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.delete("/delete", findGroup, async (req, res) => {
  try {
    await res.group.delete();
    res.status(200).json({ message: "Group has been deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/edit", findGroup, async (req, res) => {
  // FIXME
});

async function findGroup (req, res, next) {
  let group;
  const { id } = req.query;
  if (id == null) {
    res.group = null;
    return res.status(400).json({ message: "Cannot find group: No ID provided." });
  } else {
    try {
      group = await db.collection("groups").doc(id);
      const doc = await group.get();
      if (group == null || !doc.exists) {
        return res.status(404).json({ message: "Cannot find group." }); // status 404 means you cannot find something
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.group = group;
  }
  next();
}

async function generateGroupID () {
  let genStatus = false;
  let count = 1;
  while (genStatus === false && count < 50) {
    count = count + 1;
    const idToTry = createjoincode.generate(7);
    genStatus = await generateHelper(idToTry);
  }
  if (count >= 50) { return "Unable to Generate ID."; } // Break if too many iterations
  return genStatus;
}

async function generateHelper (idToTry) {
  let group;

  try {
    group = await db.collection("groups").get();
    const fixed = [];
    group.forEach(elem => fixed.push(elem));

    for (const groupDoc of fixed) {
      const groupData = groupDoc.data();
      const joinId = groupData.joinId;
      console.log(joinId, "compared to", idToTry);
      if (joinId === idToTry) {
        return false;
      }
    }
  } catch (err) {
    console.log(err.message);
  }
  return idToTry;
}

module.exports = router;
