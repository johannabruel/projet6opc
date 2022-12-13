const jwt = require ('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split (' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        if (req.body.userId && req.body.userId !== userId){
            throw 'User id non valable';
        } else {
            next()
        }
    } catch(error){
        res.status(401).json({ error });
    }
}