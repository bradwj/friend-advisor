const express = require("express");
const router = express.Router();
const { checkNotifications } = require("../lib/notifications");
const admin = require("../firebase");
const rateLimited = require("../lib/rateLimit");
const db = admin.firestore();

router.get("/test", async (req, res) => {
  if (rateLimited(req, res, 5)) return;

  const adminsDoc = await db.collection("config").doc("admins").get();

  if (adminsDoc.exists && adminsDoc.data().adminUserIds && adminsDoc.data().adminUserIds.length && adminsDoc.data().adminUserIds.includes(req.user.uid)) {
    await checkNotifications();
    res.status(200).send({ message: "OK" });
  } else {
    res.status(403).send({ message: "Access Denied" });
  }
});

module.exports = router;
