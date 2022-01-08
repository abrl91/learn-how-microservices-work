import express, {Request, Response} from "express";
import axios from "axios";


const app = express();
app.use(express.json());

const events = [];

app.post("/events", (req: Request, res: Response) => {
  const event = req.body;

  events.push(event);

  axios.post(
    "http://localhost:4000/events", 
    event).catch((err) => {
      console.log(err.message);
  });
  axios.post(
    "http://localhost:4001/events", 
    event).catch((err) => {
      console.log(err.message);
  });
  axios.post(
    "http://localhost:4002/events", 
    event).catch((err) => {
      console.log(err.message);
  });

  axios.post(
    "http://localhost:4003/events", 
    event).catch((err) => {
      console.log(err.message);
  });

  res.send({ status: "OK" });
});

app.get('/events', (req: Request, res: Response) => {
  res.send(events);
});

const PORT = 4005 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
