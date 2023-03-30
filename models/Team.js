const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TeamSchema = new Schema({
    name: String,
    imgUrl: String,
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




module.exports = model('Team', TeamSchema);

