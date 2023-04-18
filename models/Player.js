const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PlayerSchema = new Schema({
    name: String,
    imgUrl: String,
    teamId: String,
    goals: Number,
    number: Number,
});

module.exports = model('Player', PlayerSchema);

