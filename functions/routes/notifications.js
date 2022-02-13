const express = require("express");
const router = express.Router();
const { checkNotifications } = require("../lib/notifications");

router.get('/test', (req, res) => {
  checkNotifications();
  res.status(200).send({ message: 'OK' });
})

module.exports = router;