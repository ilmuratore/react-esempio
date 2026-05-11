// ============================================================
// todos.js — Route API per la risorsa "todos"
// ============================================================
// Questo file definisce i 4 endpoint CRUD della nostra API:
//
//   GET    /todos        → leggi tutte le task
//   POST   /todos        → crea una nuova task
//   PATCH  /todos/:id    → aggiorna (toggle) una task
//   DELETE /todos/:id    → elimina una task
//
// Usa il pattern async/await per gestire le operazioni
// asincrone (le query al database).
// ============================================================

const express = require('express');

// Router è un "mini-server" Express che gestisce solo
// le route di una risorsa specifica. Lo montiamo su '/todos'
// in server.js, quindi qui le route sono relative:
// router.get('/') risponde a GET /todos
// router.get('/:id') risponde a GET /todos/5
const router = express.Router();

// Importiamo il pool di connessioni al database (da db.js)
// per poter eseguire query SQL con pool.query(...)
const pool = require('./db');


const authMiddleware = require('./middleware')

router.use(authMiddleware)

// ── GET /todos ────────────────────────────────────────────────
// Restituisce tutte le task ordinate per data di creazione.
// async/await ci permette di scrivere codice asincrono
// (che aspetta la risposta del DB) come se fosse sincrono.
router.get('/', async (req, res) => {
    try {
        // pool.query() esegue la query SQL e restituisce
        // un oggetto `result` con proprietà `rows` (array di righe)
        const result = await pool.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at ASC',[req.userId]);

        // Rispondiamo con l'array di task in formato JSON.
        // res.json() imposta automaticamente Content-Type: application/json
        res.json(result.rows);

    } catch (err) {
        // Se la query fallisce (es. DB non raggiungibile),
        // rispondiamo con HTTP 500 (Internal Server Error)
        // e il messaggio d'errore per facilitare il debug.
        res.status(500).json({ errore: err.message });
    }
});


// ── POST /todos ───────────────────────────────────────────────
// Crea una nuova task nel database.
// Il corpo della richiesta deve contenere { testo: "..." }.
router.post('/', async (req, res) => {

    // Destrutturiamo il corpo della richiesta per estrarre `testo`.
    // req.body contiene l'oggetto JSON inviato dal client.
    const { testo } = req.body;

    // Validazione: se testo è assente o composto solo da spazi,
    // rispondiamo con HTTP 400 (Bad Request) prima di andare al DB.
    // testo?.trim() usa il "optional chaining": se testo è undefined
    // non crasha, restituisce undefined (falsy → entra nell'if).
    if (!testo?.trim()) return res.status(400).json({ errore: 'Testo obbligatorio' });

    try {
        // Usiamo una query parametrizzata con $1 al posto del valore.
        // Questo previene le SQL Injection: il valore non viene
        // mai inserito direttamente nella stringa SQL.
        // RETURNING * fa sì che PostgreSQL restituisca la riga appena inserita
        // (completa di id, created_at, ecc. generati dal DB).
        const result = await pool.query(
            'INSERT INTO todos (testo, user_id) VALUES ($1, $2) RETURNING *',
            [testo.trim(), req.userId]
        );

        // HTTP 201 Created: indica che la risorsa è stata creata.
        // Restituiamo l'oggetto task completo (con id e created_at).
        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ errore: err.message });
    }
});


// ── PATCH /todos/:id ─────────────────────────────────────────
// Aggiorna il campo `completato` di una singola task.
// :id è un parametro dinamico nell'URL (es. /todos/3).
router.patch('/:id', async (req, res) => {

    // req.params contiene i parametri dell'URL → { id: '3' }
    const { id } = req.params;

    // req.body contiene il JSON inviato dal client → { completato: true }
    const { completato } = req.body;

    try {
        // $1 = completato, $2 = id
        // RETURNING * restituisce la riga aggiornata
        const result = await pool.query(
            'UPDATE todos SET completato = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [completato, id, req.userId]
        );

        // rowCount indica quante righe sono state modificate.
        // Se è 0, l'id non esiste nel database → HTTP 404 Not Found.
        if (result.rowCount === 0) return res.status(404).json({ errore: 'Non trovato' });

        // Restituiamo la task aggiornata
        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ errore: err.message });
    }
});


// ── DELETE /todos/:id ─────────────────────────────────────────
// Elimina definitivamente una task dal database.
router.delete('/:id', async (req, res) => {
    try {
        // req.params.id contiene l'id nell'URL (es. /todos/5 → '5')
        const result = await pool.query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2',
            [req.params.id, req.userId]
        );

        // Se nessuna riga è stata eliminata, l'id non esiste → 404
        if (result.rowCount === 0) return res.status(404).json({ errore: 'Non trovato' });

        // HTTP 204 No Content: operazione riuscita, nessun corpo da restituire.
        // È la risposta standard per una DELETE andata a buon fine.
        res.status(204).end();

    } catch (err) {
        res.status(500).json({ errore: err.message });
    }
});


// Esportiamo il router così server.js può montarlo su '/todos'
module.exports = router;
