const express = require('express');
const router = express.Router();
const pool = require('./db');


//Get
router.get('/', async(req, res) => {
    try{
        const result = await pool.query('SELECT * FROM todos ORDER BY created_at ASC')
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ errore: err.message })
    }
})


//Post
router.post('/', async(req, res) => {
        const {testo} = req.body;
        if(!testo?.trim()) return res.status(400).json({errore: 'Testo obbligatorio'});
        try {
            const result = await pool.query('INSERT INTO todos (testo) VALUES ($1) RETURNING *',[testo.trim()] )
            res.status(201).json(result.rows[0])
        } catch (err) { res.status(500).json({ errore: err.message})}
    }
)

//Patch
router.patch('/:id', async (req, res) => {
    const { id } =  req.params
    const {completato } = req.body
    try{
        const result = await pool.query(
            'UPDATE todos SET completato = $1 WHERE id = $2 RETURNING *' , [completato, id]
        )
        if(result.rowCount === 0 ) return res.status(404).json({ errore: 'Non trovato'})
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ errore: err.message})
    }
})

//Delete 
router.delete('/:id', async(req, res) =>{
    try{
        const result = await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id])
        if(result.rowCount === 0) return res.status(404).json({errore: 'Non trovato'})
        res.status(204).end();
    } catch (err) { res.status(500).json({errore: err.message})}
})


module.exports = router 