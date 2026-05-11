const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET;


function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({errore: 'Token mancante'})
    }    

    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token, SECRET)
        req.userId = payload.userId
        next()
    } catch (err) {
        res.status(401).json({ errore: 'Token non valido' , err: err.message})
    }
}

module.exports = authMiddleware;