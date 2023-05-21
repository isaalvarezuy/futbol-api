const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const authorization = req.get('authorization');

    let token = null;
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
    }

    let decodedToken = null;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    } catch (err) { return next(err); }

    if (!token || !decodedToken) {
        return res.status(401).json({ error: 'no token' });
    }

    next();
};