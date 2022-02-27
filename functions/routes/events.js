/**
 * @openapi
 * /events/create:
 *   post:
 *     tags:
 *     - events
 *     summary: By passing in the appropriate options, you can create a new event.
 *     operationId: createEvent
 *     description: |
 *       Example Query: POST /events/create?id=groupid123456&datetime=2022-02-19T02:45:31.669Z&name=EventName&description=creating a new event&lat=0.0&long=0.0
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       id: group id
 *       description: the group id the event belongs to
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
 *       name: lat
 *       description: latitudinal coordinate of the event location
 *       required: false
 *       type: number
 *     - in: query
 *       name: long
 *       description: longitudinal coordinate of the event location
 *       required: false
 *       type: number
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

router.post("/create", findGroup, checkInGroup, async (req, res) => {
  const { id, datetime, name, description, lat, long } = req.query;
  try {
    const event = {
      groupId: id,
      datetime: new Date(datetime),
      lastUpdated: Date.now(),
      name,
      description: description || null,
      archived: false,
      sentNotifications: {
        monthBefore: [],
        weekBefore: [],
        dayBefore: [],
        dayOf: []
      }
    };
    if (lat && long) event.location = new admin.firestore.GeoPoint(Number(lat), Number(long));

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

module.exports = router;
