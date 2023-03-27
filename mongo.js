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
    color: String,
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
    color: '#FFFFF',
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



team.save().then(res => {
    console.log(res);
    mongoose.connection.close();
}

).catch(err => console.log(err));