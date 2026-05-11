import { Link } from 'react-router-dom'

function NotFound(){
    return(
        <>
        <div style={{textAlign: 'center', paddingTop: 60, minHeight: '100vh'}}>
            <h1 style={{ fontSize: '5rem' , margin: 0, color: 'white'}}>404</h1>
            <p style={{ color: 'white', marginTop: 24}}>Questa pagina non esiste</p>
            <Link to='/' style={{marginTop: 24}}>- Torna alla Home - </Link>
        </div>
        </>
    )

}

export default NotFound;