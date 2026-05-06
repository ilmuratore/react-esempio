// ============================================================
// ListaUtenti.jsx — Esempio didattico di useEffect + fetch
// ============================================================
// Questo componente NON fa parte della Todo List principale.
// È un esempio autonomo che mostra come:
//   1. Caricare dati da una API esterna al montaggio
//   2. Gestire i tre stati di una fetch: loading / errore / dati
//   3. Usare AbortController per cancellare la fetch
//      se il componente viene smontato prima che finisca
//
// L'API usata è jsonplaceholder.typicode.com: un servizio
// gratuito che simula un backend con dati finti, utile
// per fare pratica senza dover creare un server reale.
// ============================================================

import { useState, useEffect } from "react";

function ListaUtenti() {

    // ----- STATO -----------------------------------------------

    // Array degli utenti ricevuti dall'API
    const [utenti, setUtenti] = useState([]);

    // true mentre la fetch è in corso → mostriamo "Caricamento..."
    const [loading, setLoading] = useState(true);

    // Contiene il messaggio d'errore se la fetch fallisce
    const [errore, setErrore] = useState(null);


    // ----- EFFETTO DI CARICAMENTO ──────────────────────────────
    // useEffect con [] viene eseguito una sola volta,
    // dopo che il componente appare nel DOM (mount).
    useEffect(() => {

        // AbortController permette di annullare una fetch in corso.
        // Lo usiamo per evitare di aggiornare lo stato di un
        // componente che nel frattempo è già stato smontato
        // (es. l'utente naviga via prima che la fetch finisca).
        // Questo previene il classico warning React:
        // "Can't perform a state update on an unmounted component"
        const controller = new AbortController();

        // Definiamo la funzione asincrona qui dentro perché
        // useEffect non accetta direttamente una funzione async
        async function carica() {
            try {
                setLoading(true);
                setErrore(null);

                // Passiamo il signal dell'AbortController alla fetch.
                // Se controller.abort() viene chiamato (vedi return),
                // la fetch viene interrotta e lancia un AbortError.
                const res = await fetch(
                    'https://jsonplaceholder.typicode.com/users',
                    { signal: controller.signal }
                );

                // Verifichiamo che la risposta sia OK (status 2xx)
                if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);

                const data = await res.json();
                setUtenti(data);

            } catch (err) {
                // Ignoriamo l'AbortError: non è un errore reale,
                // l'errore é stato causato intenzionalmente
                // con controller.abort() nel cleanup.
                if (err.name !== 'AbortError') setErrore(err.message);

            } finally {
                // finally viene eseguito SEMPRE (successo o errore).
                // Qui aggiorniamo lo stato di setLoading.
                setLoading(false);
            }
        }

        carica(); // Avviamo la fetch

        // Funzione di cleanup: React la chiama quando il componente
        // viene smontato (o prima di rieseguire l'effetto).
        // Annulliamo la fetch in corso per evitare aggiornamenti
        // di stato su un componente che non esiste più.
        return () => controller.abort();

    }, []); // [] = eseguito solo al mount


    // ----- RENDER CONDIZIONALE ─────────────────────────────────
    if (loading) return <p>Caricamento...</p>;
    if (errore)  return <p>{errore}</p>;

    // ----- RENDER PRINCIPALE ───────────────────────────────────
    return (
        <>
            <ul>
                {/* Per ogni utente mostriamo nome ed email.
                    key={u.id} è obbligatorio per le liste in React. */}
                {utenti.map(u => (
                    <li key={u.id}>{u.name} -- {u.email}</li>
                ))}
            </ul>
        </>
    );
}

export default ListaUtenti;
