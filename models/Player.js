const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PlayerSchema = new Schema({
    name: String,
    imgUrl: String,
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    goals: Number,
    number: Number,
});

module.exports = model('Player', PlayerSchema);

