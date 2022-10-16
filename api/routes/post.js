const express = require("express");
const post_db = require("../../data/post.json");
const router = express.Router();
const writeToFile = require("../../utils/common");
const uuid = require("uuid").v4;
const appConstants = require("../../constants/appConstants");

router.get("/", (req, res) => {
  const page = req.query.page || appConstants.CURRENT_PAGE;
  const limit = req.query.limit || appConstants.CURRENT_LIMIT;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;

  const postList = [...post_db];
  const totalPage = Math.ceil(postList.length / limit);
  const total = postList.length;

  const newPostList = postList.slice(startIdx, endIdx);

  res.status(200).json({
    data: {
      data: newPostList,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        total_page: totalPage,
      },
    },
  });
});

router.post("/", (req, res) => {
  const newPostList = [...post_db];

  const post = {
    _id: uuid(),
    title: req.body.title,
    author: req.body.author,
    avatar: req.body.avatar,
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
