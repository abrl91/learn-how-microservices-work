import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());

const posts = {};

const handleEvent = (type, data) => {
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

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('listening on port 4002');

    const res = await axios.get('http://localhost:4005/events');
    for (let {type, data} of res.data) {
        console.log('Proccessing event:', type);

        handleEvent(type, data);
    }
});