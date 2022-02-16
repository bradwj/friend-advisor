/**
 * @openapi
 * /groups/create:
 *   post:
 *     tags:
 *     - groups
 *     summary: By passing in the appropriate options, you can create a new group.
 *     operationId: createGroup
 *     description: |
 *       Example Query: POST /groups/create?name=lexiiscool&creatorId=39Nl5oVBjyc3GfKzOiObVqE3o213&description=this is a description
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: name
 *       description: pass a group name
 *       required: false
 *       type: string
 *     - in: query
 *       name: creatorId
 *       description: user ID of the creator of the group
 *       required: true
 *       type: string
 *     - in: query
 *       name: description
 *       description: pass a description of the group
 *       required: false
 *       type: string
 *     responses:
 *       200:
 *         description: Returns document ID, group structure containing name, description, members, joinId
 *       500:
 *         description: error adding document
 *       404:
 *         description: no creatorId provided
 * /groups/find/allData:
 *   get:
 *     tags:
 *     - groups
 *     summary: Finds a group with given Document ID from request, returns json-encoded array of its array of data, saved as "data"
 *     description: |
 *       Example Query: GET /groups/find/allData?id=6SoVHxte3j4KmDzd85Ng
 *     operationId: findGroupData
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: query
 *       description: Document ID of group to obtain data from
 *       required: true
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
 *     description: |
 *       Example Query: GET groups/find/joinId?id=6SoVHxte3j4KmDzd85Ng
 *     operationId: findGroupJoinId
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: query
 *       description: ID of group to obtain joinId for.
 *       required: true
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
 *     description: |
 *       Example Query: DELETE groups/delete?id=ciQRf9auZZYCjCbqmcFz
 *     operationId: deleteGroup
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: query
 *       description: Document ID of group to delete
 *       required: true
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
 * /groups/edit:
 *   patch:
 *     tags:
 *     - groups
 *     summary: Edits data for group with given ID from query parameters such as name and description
 *     description: |
 *       Example Query: /groups/edit?id=zBZvVSe5MXNXLDDSnIPn&name=new group name&description=changed group description
 *     operationId: editGroup
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: query
 *       name: id
 *       description: Document ID of group to edit
 *       type: string
 *     - in: query
 *       name: name
 *       description: new name of group
 *       type: string
 *     - in: query
 *       name: description
 *       description: new description of group
 *       type: string
 *     responses:
 *       200:
 *         description: successful edit operation
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

router.post("/create", async (req, res) => { // Used to Create Group
  res.set("Access-Control-Allow-Origin", "*");
  let { name, creatorId, description } = req.query;
  if (name === undefined || name === null) { name = "No Name Provided"; }
  if (description === undefined || description === null) { description = "No Description Provided"; }
  if (creatorId === undefined || creatorId === null) { res.status(404).send({ message: "No creatorId provided, but it is a required argument." }); return; }
  const group = {
    name,
    description,
    members: [creatorId],
    joinId: await createjoincode.generate(),
    lastUpdated: Date.now()
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
    res.status(500).send({ message: e.toString() });
  }
});

// Get all data from a specific group
router.get("/find/allData", findGroup, async (req, res) => {
  try {
    const doc = await res.group.get();
    if (doc.exists) {
      res.status(200).json(doc.data());
    } else {
      res.status(404).json({ message: "Group does not exist." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtain only the joinId
router.get("/find/joinId", findGroup, async (req, res) => {
  try {
    const doc = await res.group.get();
    if (doc.exists) {
      res.status(200).json({ joinId: doc.data().joinId });
    } else {
      res.status(404).json({ message: "Group does not exist." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a group with its documentId
router.delete("/delete", findGroup, async (req, res) => {
  try {
    await res.group.delete();
    res.status(200).json({ message: "Group has been deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit a group with it's documentId and name/description as params
router.patch("/edit", findGroup, async (req, res) => {
  try {
    const updatedData = {};
    if (req.query.name) {
      updatedData.name = req.query.name;
    }
    if (req.query.description) {
      updatedData.description = req.query.description;
    }
    res.group.update(updatedData);
    res.status(200).json({ updatedData: updatedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function findGroup (req, res, next) {
  let group;
  const { id } = req.query;
  if (id === null || id === undefined) {
    res.group = null;
    return res.status(400).json({ message: "Cannot find group: No document ID provided." });
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
