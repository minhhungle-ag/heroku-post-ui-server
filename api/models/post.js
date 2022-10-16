const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  short_description: { type: String },
  createdAt: Number,
  updatedAt: Number,
  imageUrl: { type: String, required: true },
  avatar: { type: String },
});

module.exports = mongoose.model("Post", postSchema);
