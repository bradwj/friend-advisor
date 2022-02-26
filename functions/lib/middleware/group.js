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

async function findGroups (req, res, next) {
  const { uid } = req.user;
  const lastUpdated = parseInt(req.query.lastUpdated);
  if (!uid) {
    return res.status(400).json({ message: "User not logged in" });
  } else {
    try {
      const groups = db.collection("groups").where("members", "array-contains", `${uid}`).where("lastUpdated", ">", lastUpdated);
      const querySnapshot = await groups.get();
      if (querySnapshot.empty) {
        return res.status(404).json({ message: "Could not find recent groups." }); // status 404 means you cannot find something
      }
      req.groups = querySnapshot.docs;
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
  next();
}

async function checkInGroup (req, res, next) {
  // req.user.uid
  // res.group
  try {
    res.groupDoc = await res.group.get();
    const { members } = res.groupDoc.data();
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

// NOT MIDDLEWARE
async function checkGroupEmpty (req, res) {
  try {
    const { members } = res.groupDoc.data();
    if (members.length <= 0 || (members.length === 1 && members.includes(req.user.uid))) {
      await res.group.update({ archived: true }); // Archives instead of deletes
    } else {
      await res.group.update({ archived: false });
    }
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
}

module.exports = { findGroup, findGroups, checkInGroup, checkGroupEmpty };
