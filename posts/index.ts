import express, {Request, Response} from "express";
import axios from "axios";
import cors from "cors";
import { randomBytes } from "crypto";

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req: Request, res: Response) => {
  res.send(posts);
});

app.post("/posts", async (req: Request, res: Response) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post(
    "http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req: Request, res: Response) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

const PORT = 4000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
