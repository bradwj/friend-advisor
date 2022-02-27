/**
 * @openapi
 * /events/create:
 *   post:
 *     tags:
 *     - events
 *     summary: By passing in the appropriate options, you can create a new event.
 *     operationId: createEvent
 *     description: |
 *       Example Query: POST /events/create?id=aH5Fr123456&datetime=2022-02-19T02:45:31.669Z&name=EventName&description=creating a new event&lat=0.0&long=0.0
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       id: group id
 *       description: the group id (document) the event belongs to
 *       required: true
 *       type: string
 *     - in: query
 *       name: datetime
 *       description: the datetime the event occurs, should be able to be passed into `new Date(datetime)`
 *       required: true
 *       type: string
 *     - in: query
 *       name: name
 *       description: name of the event
 *       required: true
 *       type: string
 *     - in: query
 *       name: description
 *       description: description of the event
 *       required: false
 *       type: string
 *     - in: query
 *       name: location
 *       description: string description OR link to a location
 *       required: false
 *       type: string
 *     responses:
 *       200:
 *         description: Returns document ID, group structure containing name, description, members, joinId
 *       403:
 *         description: Authorization failed, or user does not have permission.
 *       500:
 *         description: error adding document
 */

const express = require("express");
const router = express.Router();
const admin = require("../firebase.js");
const db = admin.firestore();
const { findGroup, checkInGroup } = require("../lib/middleware/group.js");
const { findEvent } = require("../lib/middleware/event.js");

router.post("/create", findGroup, checkInGroup, async (req, res) => {
  let { id, datetime, name, description, location } = req.query;
  try {
    if (datetime === null || datetime === undefined) { datetime = Date.now(); };
    const event = {
      groupId: id,
      datetime: new Date(datetime),
      lastUpdated: Date.now(),
      name: name || "",
      description: description || null,
      archived: false,
      location: location || "",
      sentNotifications: {
        monthBefore: [],
        weekBefore: [],
        dayBefore: [],
        dayOf: []
      }
    };
    const docRef = await db.collection("events").add(event);
    console.log("Document written with ID:", docRef.id);
    res.status(200).send({ id: docRef.id, ...event });
  } catch (e) {
    res.status(400).send({ message: e.toString() });
  }
});

router.get("/all", async (req, res) => {
  const { uid } = req.user;
  const lastUpdated = parseInt(req.query.lastUpdated);
  if (!uid) return res.status(404).send({ message: "User not logged in." });
  try {
    const groups = (await db.collection("groups").where("members", "array-contains", `${uid}`).get()).docs;
    const groupIds = groups.map(group => ({ id: group.id, groupName: group.data().name }));
    const eventsPromise = [];
    const events = [];
    groupIds.forEach(groupId => {
      eventsPromise.push(db.collection("events").where("groupId", "==", `${groupId.id}`).where("lastUpdated", ">", lastUpdated).get());
    });
    const eventsSnapshot = await Promise.all(eventsPromise);
    eventsSnapshot.forEach(querySnapshot => {
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        events.push({ id: querySnapshot.docs[0].id, groupName: groupIds.find(group => group.id === data.groupId).groupName, ...querySnapshot.docs[0].data() });
      }
    });
    return res.status(200).json({ events });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Needs "id" to find group document, and then "eventId" to find event document.
router.patch("/edit", findGroup, checkInGroup, findEvent, async (req, res) => {
  const { datetime, name, description, location } = req.query;
  if (res.event !== null && res.event !== undefined) {
    try {
      const updatedProfileData = {
        datetime: datetime,
        name: name,
        description: description,
        location: location,
        lastUpdated: Date.now()
      };
      res.event.update(updatedProfileData);
      console.log("Document written with ID: ", res.event.id);
      res.status(200).send(updatedProfileData);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err.message });
    };
  }
});

module.exports = router;
