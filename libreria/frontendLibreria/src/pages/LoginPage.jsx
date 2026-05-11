// ============================================================
// pages/LoginPage.jsx — Pagina di accesso
// ============================================================

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Dopo il login andiamo alla pagina originalmente richiesta,
  // oppure alla home se arriviamo direttamente da /login
  const destinazione = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errore, setErrore] = useState(null)
  const [caricamento, setCaricamento] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrore(null)
    setCaricamento(true)

    try {
      // authAPI.login restituisce direttamente la stringa token
      const token = await authAPI.login(form.email, form.password)
      login(token)
      navigate(destinazione, { replace: true })
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }

  return (
    <div className="auth-layout">
      {/* Pannello sinistro — branding */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">📚</div>
          <h1 className="auth-brand-title">Biblioteca</h1>
          <p className="auth-brand-sub">
            Il sistema di gestione<br />della libreria scolastica
          </p>
        </div>
        <div className="auth-decoration">
          <div className="deco-circle deco-1" />
          <div className="deco-circle deco-2" />
          <div className="deco-circle deco-3" />
        </div>
      </div>

      {/* Pannello destro — form */}
      <div className="auth-panel-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-heading">Accedi</h2>
            <p className="auth-sub">Inserisci le tue credenziali per continuare</p>
          </div>

          {/* Messaggio di errore dal backend */}
          {errore && (
            <div className="alert alert-error">
              <span>⚠️</span> {errore}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="mario.rossi@scuola.it"
                className="form-input"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary btn-full"
              disabled={caricamento}
            >
              {caricamento ? 'Accesso in corso…' : 'Accedi'}
            </button>
          </form>

          <p className="auth-footer">
            Non hai un account?{' '}
            <Link to="/register" className="auth-link">Registrati</Link>
          </p>
        </div>
      </div>
    </div>
  )
}