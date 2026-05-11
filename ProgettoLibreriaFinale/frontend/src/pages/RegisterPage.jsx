// ============================================================
// pages/RegisterPage.jsx — Pagina di registrazione
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
  })
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
      // 1. Registriamo l'utente
      await authAPI.registra(form.nome, form.cognome, form.email, form.password)

      // 2. Facciamo subito il login automatico
      //    così l'utente non deve reinserire le credenziali
      const token = await authAPI.login(form.email, form.password)
      login(token)
      navigate('/', { replace: true })
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
            <h2 className="auth-heading">Crea account</h2>
            <p className="auth-sub">Registrati per accedere al catalogo</p>
          </div>

          {errore && (
            <div className="alert alert-error">
              <span>⚠️</span> {errore}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Nome e cognome su una riga */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input
                  id="nome"
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Mario"
                  className="form-input"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="cognome" className="form-label">Cognome</label>
                <input
                  id="cognome"
                  type="text"
                  name="cognome"
                  value={form.cognome}
                  onChange={handleChange}
                  placeholder="Rossi"
                  className="form-input"
                  required
                />
              </div>
            </div>

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
                placeholder="Almeno 8 caratteri"
                className="form-input"
                required
              />
              <p className="form-hint">
                Deve contenere maiuscola, minuscola, numero e carattere speciale
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary btn-full"
              disabled={caricamento}
            >
              {caricamento ? 'Registrazione in corso…' : 'Crea account'}
            </button>
          </form>

          <p className="auth-footer">
            Hai già un account?{' '}
            <Link to="/login" className="auth-link">Accedi</Link>
          </p>
        </div>
      </div>
    </div>
  )
}