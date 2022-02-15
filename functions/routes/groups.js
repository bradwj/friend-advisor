/**
 * @openapi
 * /groups/create:
 *   post:
 *     tags:
 *     - groups
 *     summary: creates new group
 *     operationId: createGroup
 *     description: |
 *       By passing in the appropriate options, you can create a new group.
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: name
 *       description: pass a group name
 *       type: string
 *     - in: query
 *       name: creatorId
 *       description: user ID of the creator of the group
 *       type: string
 *     responses:
 *       200:
 *         description: Returns document ID, group structure containing name, members, joinId
 *       400:
 *         description: error adding document
 * /groups/find/allData:
 *   get:
 *     tags:
 *     - groups
 *     summary: Finds a group with given Document ID from request, returns json-encoded array of its array of data, saved as "data"
 *     operationId: findGroupData
 *     parameters:
 *     - name: id
 *       in: query
 *       description: Document ID of group to obtain data from
 *       type: string
 *     responses:
 *       200:
 *         description: successful find operation
 *       400:
 *         description: no ID provided to search for.
 *       404:
 *         description: Document does not exist
 *       500:
 *         description: Other server-error
 * /groups/find/joinId:
 *   get:
 *     tags:
 *     - groups
 *     summary: Finds the joinId of a group with given ID from request, returns json-encoded array of this Id, saved as "joinId"
 *     operationId: findGroupJoinId
 *     parameters:
 *     - name: id
 *       in: query
 *       description: ID of group to obtain joinId for.
 *       type: string
 *     responses:
 *       200:
 *         description: successful find operation
 *       400:
 *         description: no ID provided.
 *       404:
 *         description: Document does not exist
 *       500:
 *         description: Other server-error
 * /groups/delete:
 *   delete:
 *     tags:
 *     - groups
 *     summary: Deletes group with given Document ID
 *     operationId: deleteGroup
 *     parameters:
 *     - name: id
 *       in: query
 *       description: Document ID of group to delete
 *       type: string
 *     responses:
 *       200:
 *         description: successful delete operation
 *       400:
 *         description: no ID provided.
 *       404:
 *         description: Document does not exist
 *       500:
 *         description: Other server-error
 */

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
    joinId: await createjoincode.generate()
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

module.exports = router;
