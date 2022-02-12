const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send('Welcome to the FriendAdvisor API');
})

module.exports = router;