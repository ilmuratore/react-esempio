const BASE = 'http://localhost:3000';


//GET 
export async function getTodos(){
    const res = await fetch(`${BASE}/todos`)
    if(!res.ok) throw new Error(`ERRORE: ${res.status}`);
    return res.json()
};


//POST
export async function createTodo(testo){
    const res = await fetch(`${BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({ testo })
    })
    if(!res.ok) throw new Error(`ERRORE: ${res.status}`);
    return res.json()
};

//PATCH
export async function updateTodo(id, completato){
    const res = await fetch(`${BASE}/todos/${id}`, {
        method : 'PATCH',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({ completato })
    })
    if(!res.ok) throw new Error(`ERRORE: ${res.status}`);
    return res.json()
};


//DELETE
export async function deleteTodo(id){
    const res = await fetch(`${BASE}/todos/${id}`, { method: 'DELETE'})
    if(!res.ok) throw new Error(`ERRORE: ${res.status}`);
};

