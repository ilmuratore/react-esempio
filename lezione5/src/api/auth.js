const BASE = 'http://localhost:3000';

export async function register(email, password){
    const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email, password})
    }) 
    if(!res.ok){
        const data = await res.json()
        throw new Error(data.errore || 'Errore registrazione')
    }
    return res.json()
}


export async function login(email, password){
     const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({email, password})
    }) 
    if(!res.ok){
        const data = await res.json()
        throw new Error(data.errore || 'Errore login')
    }
    return res.json()
}

