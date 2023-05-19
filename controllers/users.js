const usersRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

usersRouter.post('/', async (req, res) => {
    const { body } = req;
    const { username, password } = body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
        username, passwordHash
    });

    const savedUser = await user.save();
    res.json(savedUser);

});
module.exports = usersRouter;