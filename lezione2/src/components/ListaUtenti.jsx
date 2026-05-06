import { useState, useEffect } from "react";

function ListaUtenti() {
    const [utenti, setUtenti] = useState([]);

    const [loading, setLoading] = useState(true);

    const [errore, setErrore] = useState(null);


    useEffect( () => {
        const controller = new AbortController(); //simulando il backend

        async function carica(){
            try{
                setLoading(true)
                setErrore(null)

                const res = await fetch(
                    'https://jsonplaceholder.typicode.com/users',
                    { signal: controller.signal}
                )

                if(!res.ok) throw new Error(`Errore HTTP ${res.status}`)
                const data = await res.json()
                setUtenti(data)

            } catch (err) {
                if(err.name !== 'AbortError') setErrore(err.message)
            } finally {
                setLoading(false)
            }
        }

        carica()
        return () => controller.abort();
    }, [])


    if(loading) return <p>Caricamento...</p>
    if(errore) return <p> {errore} </p>

    return (
        <>
        <ul>
            {utenti.map(u => <li key={u.id}>{u.name} -- {u.email}</li>)}
        </ul>
        </>
    )
}


export default ListaUtenti