const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: String,
    passwordHash: String,
});

UserSchema.set('toJSON', {
    trasnform: (document, returnedObject) => {
        delete returnedObject.passwordHash;
    }
});

module.exports = model('User', UserSchema);

