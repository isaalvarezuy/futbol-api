const ERROR_HANDLERS = {
    JsonWebTokenError: (res) => res.status(401).json({ 'message': 'invalid token' }),
    TokenExpiredError: (res) => res.status(401).json({ 'message': 'Token has expired' }),
    defaultError: (res) => res.status(500).json({ 'message': 'Something went wrong :(' })
};

// eslint-disable-next-line no-unused-vars
module.exports = ((err, req, res, next) => {
    console.error(err.name);
    const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError;
    handler(res);
});