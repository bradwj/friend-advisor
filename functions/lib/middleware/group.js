const admin = require("../../firebase.js");
const db = admin.firestore();

async function findGroup (req, res, next) {
  let group;
  const { id } = req.query;
  if (id === null || id === undefined) {
    res.group = null;
    return res
      .status(400)
      .json({ message: "Cannot find group: No document ID provided." });
  } else {
    try {
      group = await db.collection("groups").doc(id);
      const doc = await group.get();
      if (!doc.exists) {
        return res.status(404).json({ message: "Cannot find group." }); // status 404 means you cannot find something
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.group = group;
  }
  next();
}

async function checkInGroup (req, res, next) {
  // req.user.uid
  // res.group
  try {
    const doc = await res.group.get();
    const { members } = doc.data();
    const found = members.find((member) => member === req.user.uid);
    if (!found) {
      return res.status(403).json({
        message:
          "User not in group; does not have permission to run this endpoint."
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

exports.default = { findGroup, checkInGroup };
