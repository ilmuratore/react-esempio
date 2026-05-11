const express = require('express');
const router = express.Router();
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 


const SECRET = process.env.JWT_SECRET

//POST - Register
router.post('/register' , async(req, res) =>{
    const {email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ errore: 'Email e password obbligatorie'});
    }

    try{
        const check = await pool.query('SELECT id FROM users WHERE email = $1', [email])
        if(check.rows.length > 0){
            return res.status(400).json({ errore: 'Email giá registrata'});
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await pool.query(
            'INSERT INTO users(email, password) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]
        )
        res.status(201).json({ message: 'Utente Registrato', user: result.rows[0]})
    } catch (err) { 
        res.status(500).json({ errore: err.message})
    }
})


//POST - Login
router.post('/login' , async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ errore: 'Email e password obbligatorie'});
    }

    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if(result.rows.length === 0){
            return res.status(400).json({ errore: 'Credenziali non valide'});
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if(!valid){
            return res.status(400).json({ errore: 'Credenziali non valide'})
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email}, //Payload
            SECRET, 
            { expiresIn: '1h'}
        )
        res.json({token, user: {id: user.id, email: user.email}})
    } catch(err){
        res.status(500).json({ errore: err.message})
    }
})


//GET - auth/me
router.get('/me', async(req, res) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({errore: 'Token mancante'})
    }    

    const token = authHeader.split(' ')[1]

    try{
        const payload = jwt.verify(token, SECRET)
        const result = await pool.query('SELECT * FROM users WHERE id = $1',[payload.userId])

        if(result.rows.length === 0){
            return res.status(404).json({ errore: 'Utente non trovato'})
        }

        res.status(201).json({ user: result.rows[0]})

    } catch (err) {
        res.status(401).json({ errore: err.message})
    }
})


module.exports = router

