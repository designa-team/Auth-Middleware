var jsonwebtoken = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    req.user = undefined;
    if (req.headers
        && req.headers.authorization
        && req.headers.authorization.startsWith("Bearer ")
        && process.env.JWT_SECRET) {
        const token = req.headers.authorization.slice(7, req.headers.authorization.length);
        jsonwebtoken.verify(token, process.env.JWT_SECRET, function (err, decode) {
            if (!err) {
              req.user = decode;
              next();
            } else {
                res.status(403).json({ message: "unauthorized" });
            }
        });
    } else {
        res.status(403).json({ message: "unauthorized" });
    }
}

module.exports = authMiddleware;