const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const GameHistorySchema = new Schema({
    opponent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    goalsFor: Number,
    goalsAgainst: Number,
    result: String
});

const TeamSchema = new Schema({
    name: String,
    imgUrl: String,
    goalsFor: Number,
    goalsAgainst: Number,
    ties: Number,
    loses: Number,
    games: Number,
    wins: Number,
    gameHistory: [GameHistorySchema],
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
});




module.exports = model('Team', TeamSchema);

