const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Post = require("../models/post");
const checkAuth = require("../middleware/checkAuth");

const currentLimit = 5;
const currentPage = 1;

router.get("/", (req, res) => {
  if (req.query.page <= 0) {
    res.status(500).json({
      message: "page must be more than 0",
    });
  }

  Post.find()
    .select("title author updatedAt createAt description imageUrl")
    .exec()
    .then((data) => {
      if (Array.isArray(data)) {
        const page = req.query.page || currentPage;
        const limit = req.query.limit || currentLimit;
        const startIdx = (page - 1) * limit;
        const endIdx = page * limit;

        const postList = [...data];
        const totalPage = Math.ceil(postList.length / limit);
        const total = postList.length;

        const newPostList = postList.slice(startIdx, endIdx);

        res.status(200).json({
          data: {
            message: "get all success",
            data: newPostList,
            pagination: {
              page: page,
              limit: limit,
              total: total,
              total_page: totalPage,
            },
          },
        });
      }
    });
});

router.get("/:postId", (req, res) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .select("title author updatedAt createAt imageUrl")
    .exec()
    .then((response) => {
      console.log("response: ", response);
      if (response) {
        res.status(200).json({
          data: {
            data: response,
          },
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: {
          message: error.message,
        },
      });
    });
});

router.post("/", (req, res) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    author: req.body.author,
    short_description: req.body.short_description,
    description: req.body.description,
    createAt: new Date(),
    imageUrl: req.body.imageUrl,
  });

  post
    .save()
    .then((result) => {
      if (result) {
        res.status(200).json({
          data: result,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: {
          message: error.message,
        },
      });
    });
});

router.patch("/:postId", checkAuth, (req, res) => {
  const postId = req.params.postId;

  Post.updateOne(
    { _id: postId },
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        updatedAt: new Date(),
        imageUrl: req.body.imageUrl,
      },
    }
  )
    .exec()
    .then((response) => {
      res.status(200).json({
        message: `Edit post success`,
        data: response,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: {
          message: error.message,
        },
      });
    });
});

router.delete("/:postId", checkAuth, (req, res) => {
  const postId = req.params.postId;

  Post.remove({ _id: postId })
    .exec()
    .then((response) => {
      res.status(200).json({
        message: `Deleted post by ${postId}`,
        data: response,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        error: {
          message: error.message,
        },
      });
    });
});

module.exports = router;
