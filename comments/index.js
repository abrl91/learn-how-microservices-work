const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  await axios.post(
    "http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      status: 'pending',
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Event Received", req.body.type);

  const {type, data} = req.body;

  if (type === 'CommentModerated') {
    const {postId, id, status} = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find(c => c.id === id);
    comment.status = status;

    await axios.post('http://localhost:4005', {
      type: 'CommentUpdated',
      data: { id, postId, content, status }
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
