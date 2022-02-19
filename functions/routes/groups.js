/**
 * @openapi
 * /groups/create:
 *   post:
 *     tags:
 *     - groups
 *     summary: By passing in the appropriate options, you can create a new group.
 *     operationId: createGroup
 *     description: |
 *       Example Query: POST /groups/create?name=lexiiscool&description=this is a description
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: name
 *       description: pass a group name
 *       required: false
 *       type: string
 *     - in: query
 *       name: description
 *       description: pass a description of the group
 *       required: false
 *       type: string
 *     responses:
 *       200:
 *         description: Returns document ID, group structure containing name, description, members, joinId
 *       403:
 *         description: Authorization failed, or user does not have permission.
 *       500:
 *         description: error adding document
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
 *       403:
 *         description: Authorization failed, or user does not have permission.
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
 *       403:
 *         description: Authorization failed, or user does not have permission.
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
 *       403:
 *         description: Authorization failed, or user does not have permission.
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
 *       Example Query: PATCH /groups/edit?id=zBZvVSe5MXNXLDDSnIPn&name=new group name&description=changed group description
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
 *       403:
 *         description: Authorization failed, or user does not have permission.
 *       404:
 *         description: Document does not exist
 *       500:
 *         description: Other server-error
 * /groups/join:
 *   patch:
 *     tags:
 *     - groups
 *     summary: Adds a member to a group, given a joinId
 *     description: |
 *       Example Query: PATCH /groups/join?joinId=eAboFZ
 *     operationId: joinGroup
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: query
 *       name: joinId
 *       description: joinId of group to join
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: successful join operation
 *       400:
 *         description: member already in group requested
 *       403:
 *         description: Authorization failed, or user does not have permission.
 *       404:
 *         description: Group does not exist or could not be found
 *       500:
 *         description: Other server-error
 */

const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const createjoincode = require("../lib/createjoincode.js");
const { findGroup, checkInGroup } = require("../lib/middleware/group.js");
const db = admin.firestore();

router.post("/create", async (req, res) => { // Used to Create Group
  let { name, description } = req.query;
  if (name === undefined || name === null) { name = "No Name Provided"; }
  if (description === undefined || description === null) { description = "No Description Provided"; }
  const group = {
    name,
    description,
    members: [req.user.uid],
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

// Adds a member to a group, given a joinId
router.patch("/join", async (req, res) => {
  const { joinId } = req.query;
  const userId = req.user.uid;
  if (joinId === undefined || joinId === null || userId === undefined || userId === null) { res.status(404).send({ message: "No Id provided, but it is a required argument." }); return; }
  try {
    const group = await db.collection("groups").where("joinId", "==", joinId).get();
    if (group.empty) {
      res.status(404).json({ message: "Group does not exist.", joined: false });
    } else {
      const fixed = [];
      group.forEach(elem => fixed.push(elem));
      const groupDoc = await fixed.at(0);
      const { members } = groupDoc.data();
      const found = members.find((member) => member === userId);
      if (found) {
        return res.status(400).json({ message: "Member already in group!", joined: false });
      }
      console.log(groupDoc.id, userId);
      const arrayToUpdate = admin.firestore.FieldValue.arrayUnion(userId);
      await db.collection("groups").doc(groupDoc.id).update({ members: arrayToUpdate, lastUpdated: Date.now() });
      res.status(200).json({ message: "Member has successfully been added.", joined: true });
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    res.status(500).send({ message: e.toString(), joined: false });
  }
});

// Get all data from a specific group
router.get("/find/allData", findGroup, checkInGroup, async (req, res) => {
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
router.get("/find/joinId", findGroup, checkInGroup, async (req, res) => {
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
router.delete("/delete", findGroup, checkInGroup, async (req, res) => {
  try {
    await res.group.delete();
    res.status(200).json({ message: "Group has been deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit a group with it's documentId and name/description as params
router.patch("/edit", findGroup, checkInGroup, async (req, res) => {
  try {
    const updatedData = {};
    if (req.query.name) {
      updatedData.name = req.query.name;
    }
    if (req.query.description) {
      updatedData.description = req.query.description;
    }
    updatedData.lastUpdated = Date.now();
    res.group.update(updatedData);
    res.status(200).json({ updatedData: updatedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
