const express = require("express");
const postList = require("../../data/post.json");
const router = express.Router();
const writeToFile = require("../../utils/common");
const uuid = require("uuid").v4;

router.get("/", (req, res) => {
  res.status(200).json({
    data: {
      data: postList,
    },
  });
});

router.post("/", (req, res) => {
  const newPostList = [...postList];

  const post = {
    _id: uuid(),
    title: req.body.title,
    author: req.body.author,
    short_description: req.body.short_description,
    description: req.body.description,
    createAt: new Date(),
    imageUrl: req.body.imageUrl,
  };

  const data = [post, ...newPostList];
  writeToFile(data, "./data/post.json");

  res.status(200).json({
    data: {
      data: post,
    },
  });
});
module.exports = router;
