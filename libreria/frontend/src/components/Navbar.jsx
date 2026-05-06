// ============================================================
// components/Navbar.jsx — Barra di navigazione
// ============================================================

import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { utente, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">📚</span>
        <Link to="/" className="navbar-title">Biblioteca</Link>
      </div>

      <div className="navbar-links">
        <Link to="/"          className={`nav-link ${isActive('/')          ? 'active' : ''}`}>Catalogo</Link>
        <Link to="/prestiti"  className={`nav-link ${isActive('/prestiti')  ? 'active' : ''}`}>Prestiti</Link>
        {/* Il link Admin è visibile solo agli amministratori */}
        {utente?.ruolo === 'admin' && (
          <Link to="/admin" className={`nav-link nav-link-admin ${isActive('/admin') ? 'active' : ''}`}>
            ⚙️ Admin
          </Link>
        )}
      </div>

      <div className="navbar-user">
        <span className="user-info">
          {utente?.ruolo === 'admin' && (
            <span className="badge-admin">admin</span>
          )}
          <span className="user-email">{utente?.email}</span>
        </span>
        <button className="btn-logout" onClick={logout}>Esci</button>
      </div>
    </nav>
  )
}