// ============================================================
// server.js — Punto di ingresso del backend Express
// ============================================================
// Questo file crea il server HTTP, configura i middleware
// globali e registra le route. È il "main" del backend:
// va avviato con `node server.js`.
// ============================================================

// Express è il framework che semplifica la creazione di server
// HTTP in Node.js: gestisce routing, middleware, req/res, ecc.
const express = require('express');

// cors (Cross-Origin Resource Sharing) è un middleware che
// permette al browser di fare richieste verso un dominio
// diverso da quello della pagina. Senza di esso, il browser
// bloccherebbe le richieste dal frontend (localhost:5173)
// verso il backend (localhost:3000).
const cors = require('cors');

// Importiamo il router con tutte le route /todos
// (definite in todos.js)
const todosRoutes = require('./todos');
const authRoutes = require('./auth')

// dotenv carica le variabili dal file .env in process.env
require('dotenv').config();


// Creiamo l'applicazione Express
const app = express();

// Porta su cui il server ascolterà le richieste
const PORT = 3000;


// ── MIDDLEWARE GLOBALI ────────────────────────────────────────
// I middleware sono funzioni che elaborano ogni richiesta
// PRIMA che arrivi alla route specifica. Si applicano
// nell'ordine in cui sono registrati con app.use().

// Attiviamo CORS solo per il frontend React (localhost:5173).
// origin: specifica chi può fare richieste al nostro server.
app.use(cors({ origin: 'http://localhost:5173' }));

// Permette a Express di leggere il corpo delle richieste
// in formato JSON (es. { testo: "Nuova task" }).
// Senza questo middleware, req.body sarebbe sempre undefined.
app.use(express.json());

// Registriamo il router delle todos: tutte le richieste
// che iniziano con '/todos' verranno gestite da todos.js.
// Es. GET /todos → router.get('/')
//     POST /todos → router.post('/')
//     PATCH /todos/5 → router.patch('/:id')
app.use('/todos', todosRoutes);
app.use('/auth', authRoutes)

// ── ROUTE DI HEALTH CHECK ─────────────────────────────────────
// Endpoint semplice per verificare che il server sia attivo.
// Utile per monitoraggio e debugging: basta fare
// GET http://localhost:3000/health e si ottiene { status: 'ok' }
app.get('/health', (req, res) => res.json({ status: 'ok' }));


// ── AVVIO DEL SERVER ──────────────────────────────────────────
// listen() mette il server in ascolto sulla porta specificata.
// Il callback viene eseguito una sola volta, quando il server
// è pronto a ricevere richieste.
app.listen(PORT, () => console.log(`SERVER IN ASCOLTO SU http://localhost:${PORT}`));
