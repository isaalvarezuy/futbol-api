const usersRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

    const userForToken = { username: savedUser.username, id: savedUser._id };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 24 * 7 });

    res.send({ username, token });



});
module.exports = usersRouter;