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
    isDeleted: Boolean
});

PlayerSchema.pre('find', function () {
    this.where({ isDeleted: false });
});

PlayerSchema.pre('findOne', function () {
    this.where({ isDeleted: false });
});

module.exports = model('Player', PlayerSchema);

