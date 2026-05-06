// ============================================================
// src/api/todos.js — Funzioni di comunicazione con il backend
// ============================================================
// Questo file centralizza tutte le chiamate HTTP verso l'API.
// Ogni funzione corrisponde a un endpoint del backend:
//
//   getTodos()           → GET    /todos
//   createTodo(testo)    → POST   /todos
//   updateTodo(id, flag) → PATCH  /todos/:id
//   deleteTodo(id)       → DELETE /todos/:id
//
// Tenere le fetch qui (invece che direttamente in App.jsx)
// ha un vantaggio: se l'URL del backend cambia, lo modifichiamo
// in un solo posto invece che in tutto il progetto.
// ============================================================

// URL base del backend. Tutte le funzioni lo usano come prefisso.
const BASE = 'http://localhost:3000';


// ── GET /todos ───────────────────────────────────────────────
// Recupera tutte le task dal database.
// Restituisce una Promise che si risolve con l'array di task.
export async function getTodos() {
    // fetch() fa una richiesta HTTP GET (metodo di default)
    const res = await fetch(`${BASE}/todos`);

    // res.ok è true se lo status HTTP è tra 200 e 299.
    // Se il server risponde con 500 o 404, lanciamo un errore
    // che verrà catturato dal .catch() in App.jsx.
    if (!res.ok) throw new Error(`ERRORE: ${res.status}`);

    // res.json() legge il corpo della risposta e lo converte
    // da stringa JSON a oggetto/array JavaScript
    return res.json();
}


// ── POST /todos ──────────────────────────────────────────────
// Invia una nuova task al backend per salvarla nel DB.
// Restituisce la task creata (con id e created_at generati dal DB).
export async function createTodo(testo) {
    const res = await fetch(`${BASE}/todos`, {
        method: 'POST',

        // Diciamo al server che stiamo inviando dati in formato JSON
        headers: { 'Content-Type': 'application/json' },

        // JSON.stringify converte l'oggetto JavaScript in stringa JSON
        // { testo } è shorthand per { testo: testo }
        body: JSON.stringify({ testo })
    });

    if (!res.ok) throw new Error(`ERRORE: ${res.status}`);
    return res.json();
}


// ── PATCH /todos/:id ─────────────────────────────────────────
// Aggiorna il campo `completato` di una task specifica.
//   id         → quale task modificare (va nell'URL)
//   completato → nuovo valore booleano (va nel corpo JSON)
export async function updateTodo(id, completato) {
    const res = await fetch(`${BASE}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completato })
    });

    if (!res.ok) throw new Error(`ERRORE: ${res.status}`);

    // Restituiamo la task aggiornata così App.jsx può
    // aggiornare lo stato locale con i dati reali del DB
    return res.json();
}


// ── DELETE /todos/:id ────────────────────────────────────────
// Elimina una task dal database.
// Non restituisce nulla (il backend risponde con HTTP 204).
export async function deleteTodo(id) {
    const res = await fetch(`${BASE}/todos/${id}`, { method: 'DELETE' });

    if (!res.ok) throw new Error(`ERRORE: ${res.status}`);

    // Nessun return: DELETE restituisce 204 No Content,
    // quindi non c'è un corpo JSON da leggere
}
