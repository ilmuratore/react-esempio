import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';

function DettaglioProdotto(){
    const { id }  = useParams();
    const [prodotto, setProdotto] = useState(null);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    function handleElimina(){
        navigate('/stats')
        }
    
    /*
    useEffect( () => {
        getProdotti()
        .then(data => {
            const trovato = data.find(p => p.id === Number(id))
            setProdotto(trovato || null)
            setLoading(false)
        })
    }, [id])  */



    if(loading) return <p>Caricamento ...</p>
    return (

        <>
        <p>Stai guardando il prodotto con numero {id}</p>
        <p>Il nome del prodotto é </p>

        <button onClick={handleElimina}>Elimina</button>
        <button onClick={() => navigate(-1)}>- Indietro</button>
        <button onClick={() => navigate(1)}>Avanti -</button>
        </>
    )
    
    

}

export default DettaglioProdotto;