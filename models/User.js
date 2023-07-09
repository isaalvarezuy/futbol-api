const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: String,
    passwordHash: String,
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
});

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.passwordHash;
    }
});

module.exports = model('User', UserSchema);

