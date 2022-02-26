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
 * /groups:
 *   get:
 *     tags:
 *     - groups
 *     summary: Finds a group and recent members with given Document ID and lastUpdated time from request, returns object with property group (containing group data) and recentUsers (array of users updated after lastUpdated)
 *     description: |
 *       Example Query: GET /groups?id=6SoVHxte3j4KmDzd85Ng?lastUpdated=0
 *     operationId: getGroupData
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: query
 *       description: Document ID of group to obtain data from
 *       required: true
 *       type: string
 *     - name: lastUpdated
 *       in: query
 *       description: time in ms of last users cache update
 *       required: true
 *       type: number
 *     responses:
 *       200:
 *         description: successful get operation
 *       400:
 *         description: no ID provided to search for.
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
 * /groups/leave:
 *   patch:
 *     tags:
 *     - groups
 *     summary: Removes a member from a group
 *     description: |
 *       Example Query: PATCH /groups/leave?id=groupid123456
 *     operationId: leaveGroup
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: query
 *       name: id
 *       description: group id
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: successful leave operation
 *       400:
 *         description: no group id provided
 *       403:
 *         description: Authorization failed, or user does not have permission.
 *       404:
 *         description: Group does not exist or could not be found
 *       500:
 *         description: Other server-error
 * /groups/all:
 *   get:
 *     tags:
 *     - groups
 *     summary: Returns all groups a user is a part of
 *     description: |
 *       Example Query: GET /groups/all?lastUpdated=0
 *     operationId: allGroups
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: query
 *       name: lastUpdated
 *       description: time of last cache
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: successful fetch operation
 *       400:
 *         description: user not logged in
 *       404:
 *         description: Could not find recent groups.
 *       500:
 *         description: Other server-error
 */

const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const createjoincode = require("../lib/createjoincode.js");
const { findGroup, checkInGroup, findGroups } = require("../lib/middleware/group.js");
const db = admin.firestore();

router.post("/create", async (req, res) => {
  // Used to Create Group
  let { name, description } = req.query;
  if (name === undefined || name === null) {
    name = "No Name Provided";
  }
  if (description === undefined || description === null) {
    description = "No Description Provided";
  }
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
  } catch (err) {
    console.error("Error adding document: ", err);
    res.status(500).send({ message: err.toString() });
  }
});

// Adds a member to a group, given a joinId
router.patch("/join", async (req, res) => {
  const { joinId } = req.query;
  const userId = req.user.uid;
  if (
    joinId === undefined ||
    joinId === null ||
    userId === undefined ||
    userId === null
  ) {
    res
      .status(404)
      .send({ message: "No Id provided, but it is a required argument." });
    return;
  }
  try {
    const group = await db
      .collection("groups")
      .where("joinId", "==", joinId)
      .get();
    if (group.empty) {
      res.status(404).json({ message: "Group does not exist.", joined: false });
    } else {
      const fixed = [];
      group.forEach((elem) => fixed.push(elem));
      const groupDoc = await fixed.at(0);
      const { members } = groupDoc.data();
      const found = members.find((member) => member === userId);
      if (found) {
        return res
          .status(400)
          .json({ message: "Member already in group!", joined: false });
      }
      console.log(groupDoc.id, userId);
      const arrayToUpdate = admin.firestore.FieldValue.arrayUnion(userId);
      await db
        .collection("groups")
        .doc(groupDoc.id)
        .update({ members: arrayToUpdate, lastUpdated: Date.now() });
      res
        .status(200)
        .json({ message: "Member has successfully been added.", joined: true });
    }
  } catch (err) {
    console.error("Error adding document: ", err);
    res.status(500).send({ message: err.toString(), joined: false });
  }
});

// Get all data from a specific group and most updated user data
router.get("/", findGroup, checkInGroup, async (req, res) => {
  try {
    const docData = res.groupDoc.data();
    const lastUpdated = parseInt(req.query.lastUpdated);
    const group = { ...docData };
    const userQueries = [];
    const recentUsers = [];
    docData.members.forEach(member => {
      userQueries.push(db.collection("users").where("userId", "==", member).where("lastUpdated", ">", lastUpdated).get());
    });
    const querySnapshots = await Promise.all(userQueries);
    querySnapshots.forEach(snap => {
      if (!snap.empty) recentUsers.push(snap.docs[0].data());
    });
    res.status(200).json({ group, recentUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// return all recent user groups
router.get("/all", findGroups, async (req, res) => {
  try {
    const groups = [];
    req.groups.forEach(doc => {
      groups.push({ id: doc.id, members: doc.data().members, name: doc.data().name, lastUpdated: doc.data().lastUpdated, joinId: doc.data().joinId });
    });
    return res.status(200).json({ groups: groups });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete a group with its documentId
router.delete("/delete", findGroup, checkInGroup, async (req, res) => {
  try {
    await res.group.delete();
    res.status(200).json({ message: "Group has been deleted successfully." });
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

// Remove a user from a group
router.patch("/leave", findGroup, checkInGroup, async (req, res) => {
  try {
    const removeUser = admin.firestore.FieldValue.arrayRemove(req.user.uid);
    console.log(res.groupDoc.id);
    await db
      .collection("groups")
      .doc(res.groupDoc.id)
      .update({ members: removeUser, lastUpdated: Date.now() });
    res
      .status(200)
      .json({
        message: "Member has successfully been removed from the group."
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
