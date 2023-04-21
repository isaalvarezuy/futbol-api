require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

//models
const Team = require('./models/Team');
const Player = require('./models/Player');

//middlewares
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');

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
app.use(bodyParser.text());



app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
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

app.get('/teams/:id', async (req, res, next) => {
    const id = req.params.id;
    Team.findById(id).then(team => {
        if (team) {
            return res.json(team);
        } else {
            return res.status(404).end();
        }
    }).catch((err) =>
        next(err)
    );
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

/* app.delete('/teams/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedTeam = await Team.findByIdAndRemove(id);
        console.log(deletedTeam);
        if (!deletedTeam) {
            return res.status(404).end();
        }
        res.status(204).end(); // 204: No Content
    } catch (error) {
        next(error);
    }
}); */

app.delete('/teams/:id', (req, res, next) => {
    const id = req.params.id;
    Team.findByIdAndRemove(id).then(team => {
        if (!team) {
            res.status(404).end();
        }
        res.json(team);
        res.status(204).end();
    }
    ).catch(err => next(err));

});

app.post('/players', async (req, res) => {

    const file = req.files.photo;

    const image = await cloudinary.uploader.upload(file.tempFilePath, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        folder: 'football-app'
    });

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



app.use(notFound);
app.use(handleErrors);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
