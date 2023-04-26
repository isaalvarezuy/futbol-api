
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const GameSchema = new Schema({
    teamOneId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    teamTwoId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
    teamOneGoals: Number,
    teamTwoGoals: Number,
});

module.exports = model('Game', GameSchema);