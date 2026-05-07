import { Link } from 'react-router-dom'

function NotFound(){
    return(
        <>
        <div>
            <h1>404</h1>
            <p>Questa pagina non esiste</p>
            <Link to='/'>- Torna alla Home - </Link>
        </div>
        </>
    )

}

export default NotFound;