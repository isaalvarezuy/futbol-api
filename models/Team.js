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
    gameHistory: Array,
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
});




module.exports = model('Team', TeamSchema);

