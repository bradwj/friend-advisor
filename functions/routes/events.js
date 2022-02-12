const express = require("express");
const router = express.Router();

router.post("/create", async (req, res) => {
  const { groupId, datetime, name, description, location } = req.query;
  
  
  res.status(200).send("Welcome to the FriendAdvisor API");
});

module.exports = router;