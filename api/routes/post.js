const express = require("express");
const postList = require("../../data/post.json");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    data: {
      data: postList,
    },
  });
});

module.exports = router;
