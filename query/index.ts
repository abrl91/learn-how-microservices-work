import express, {Request, Response} from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());

const posts = {};

const handleEvent = (type: string, data: Record<string, any>) => {
    if (type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        post?.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(c => c.id === id);
        comment.status = status;
        comment.comment = content;
    }
}

app.use(cors()); 

app.get('/posts', (req: Request, res: Response) => {
    res.send(posts);
});

app.post('/events', (req: Request, res: Response) => {
    const { type, data } = req.body;
    handleEvent(type, data);

    res.send({});
});

const PORT = '4002' || process.env.PORT;

app.listen(PORT, () =>  {
    console.log(`listening on port ${PORT}`);

    axios.get('http://localhost:4005/events')
        .then((response) => {
            for (let {type, data} of response.data) {
                console.log('Processing event:', type);

                handleEvent(type, data);
            }
        })
        .catch(err => console.log(err));


});