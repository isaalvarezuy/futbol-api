const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');

loginRouter.post('/', async (req, res) => {
    const { body } = req;
    const { username, password } = body;
    const user = await User.findOne({ username });

    const passwordCorrect = user ?
        await bcrypt.compare(password, user.passwordHash) :
        false;

    if (!passwordCorrect) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const userForToken = { username: user.username, id: user._id };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET);

    res.send({ username, token });
});

module.exports = loginRouter;