import express,  {Request, Response} from "express";
import axios from "axios";
import cors from "cors";
import { randomBytes } from "crypto";

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req: Request, res: Response) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req: Request, res: Response) => {
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

app.post("/events", async (req: Request, res: Response) => {
  console.log("Event Received", req.body.type);

  const {type, data} = req.body;

  if (type === 'CommentModerated') {
    const {postId, id, status} = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find(c => c.id === id);
    comment.status = status;

    await axios.post('http://localhost:4005', {
      type: 'CommentUpdated',
      data: { id, postId, content: data.content, status }
    });
  }

  res.send({});
})

const PORT = 4001 || process.env.PORT;

app.listen(4001, () => {
  console.log(`Listening on ${PORT}`);
});
