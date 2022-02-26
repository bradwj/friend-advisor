const admin = require("../../firebase.js");
const db = admin.firestore();

async function findEvent (req, res, next) {
  let event;
  const { eventId } = req.query;
  if (eventId === null || eventId === undefined) {
    res.event = null;
    return res
      .status(400)
      .json({ message: "Cannot find event: No document eventId proveventIded." });
  } else {
    try {
      event = await db.collection("events").doc(eventId);
      const doc = await event.get();
      if (!doc.exists) {
        return res.status(404).json({ message: "Cannot find event." }); // status 404 means you cannot find something
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.event = event;
  }
  next();
}

module.exports = { findEvent };
