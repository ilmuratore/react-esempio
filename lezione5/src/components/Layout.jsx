import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

function Layout() {

  const [user, setUser] = useState(null)
  const navigate = useNavigate()


  useEffect( () => {
    const token = sessionStorage.getItem('token')
    if(!token) return 

    fetch('http://localhost:3000/auth/me', {
      headers: { 'Authorization' : `Bearer ${token}`}
    })
    .then(res => res.json())
    .then(data => setUser(data.user))
    .catch( () => {
      sessionStorage.removeItem('token')
      navigate('/login')
    })
  }, [navigate])

  function handleLogout(){
    sessionStorage.removeItem('token')
    navigate('/login')
  }


  return (
    <>
      <div className="layout">
        <header className="layout-header">
          <span className="logo">📝 TODO APP</span>
          <nav>
            <NavLink to="/" className={({isActive}) => isActive ? 'attivo' : ''}>Lista</NavLink>
            <NavLink to="/stats" className={({isActive}) => isActive ? 'attivo' : ''}>Statistiche</NavLink>
          </nav>

          <div className="layout-user">
            {user && <span className="user-email">{user.email}</span>}
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </header>

        <main className="layout-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;
