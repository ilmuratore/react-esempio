function Riepilogo({totale, completati}){
    const rimanenti = totale - completati

    return(
        <>
        <div className="riepilogo">
        <span>✅ {completati} completati</span>
        <span>🔴 {rimanenti} da fare</span>
        </div>
        </>
    )
}

export default Riepilogo