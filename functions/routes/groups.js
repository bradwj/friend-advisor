const express = require("express");
const router = express.Router();

router.post("/create", async (req, res) => {
    const {name} = req.query;

})
router.post("/addmember", async (req, res) => {
    const {memberId} = req.query;
    
})

module.exports = router;