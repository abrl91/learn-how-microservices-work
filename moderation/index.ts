import express, {Request, Response} from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post('/events', async (req: Request, res: Response) => {
    const {type, data} = req.body;
    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }
    res.send({});
});

const PORT = 4003 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
