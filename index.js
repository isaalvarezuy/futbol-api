require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

//models
const Team = require('./models/Team');
const Player = require('./models/Player');

const app = express();
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 5 * 2024 * 1024 }
}));

const connectionString = `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.8eqwb.mongodb.net/futbol-app?retryWrites=true&w=majority`;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(
    connectionString, { useNewUrlParser: true })
    .then(() => console.log('connected'))
    .catch(e => console.log(e));

app.use(cors());
app.use(express.json());



app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});


app.get('/teams', async (req, res) => {
    Team.find({}).then(teams => {
        if (teams) {
            res.json(teams);
        } else {
            return res.json({ message: 'Error' });
        }
    });
});

app.post('/teams', async (req, res) => {
    const file = req.files.crest;

    const image = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        folder: 'football-app'
    });

    const team = new Team({
        name: req.body.name,
        imgUrl: image.url,
        goalsFor: 0,
        goalsAgainst: 0,
        ties: 0,
        loses: 0,
        games: 0,
        wins: 0,
        gameHistory: [],
    });

    const productStored = await team.save();
    res.json({ productStored });
});

app.post('/players', async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const file = req.files.photo;

    const image = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        folder: 'football-app'
    });
    console.log(image);

    const { name, teamId, number } = req.body;
    const player = new Player({
        name,
        imgUrl: image.url,
        teamId,
        goals: 0,
        number,
    });

    const playerSaved = await player.save();
    res.json({ playerSaved });
});


app.use((request, response) => {
    response.status(404).json({ error: 'Not found' });

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
