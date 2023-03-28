const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();


const mongoose = require('mongoose');
const { Schema, model } = mongoose;
require('dotenv').config();

const connectionString = `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.8eqwb.mongodb.net/futbol-app?retryWrites=true&w=majority`;

mongoose.connect(
    connectionString, { useNewUrlParser: true })
    .then(() => console.log('connected'))
    .catch(e => console.log(e));

const teamSchema = new Schema({
    name: String,
    image: String,

    goalsFor: Number,
    goalsAgainst: Number,
    ties: Number,
    loses: Number,
    games: Number,
    wins: Number,
    goalDifference: Number,
    points: Number,
    lastFiveGames: Array,
    gameHistory: Array,
});

const Team = model('Team', teamSchema);

const team = new Team({
    name: 'Atelti2',
    image: 'fdsf',
    goalsFor: 0,
    goalsAgainst: 0,
    ties: 0,
    loses: 0,
    games: 0,
    wins: 0,
    goalDifference: 0,
    points: 0,
    lastFiveGames: [],
    gameHistory: [],
});


let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        date: '2019-05-30T17:30:31.098Z',
        important: true
    },
    {
        id: 2,
        content: 'Browser can execute only Javascript',
        date: '2019-05-30T18:39:34.091Z',
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        date: '2019-05-30T19:20:14.298Z',
        important: true
    }
];

app.use(cors());
app.use(express.json());
// Use the express-fileupload middleware
app.use(fileUpload());

app.use(express.static('public'));


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
    response.json(notes);
});
app.post('/add-team', (request, response) => {
    console.log(request.files);
    /*  team.save().then(res => {
         console.log(res);
         mongoose.connection.close();
     }
     ).catch(err => console.log(err)); */
    response.json('hola');
});

app.use((request, response) => {
    response.status(404).json({ error: 'Not found' });

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
