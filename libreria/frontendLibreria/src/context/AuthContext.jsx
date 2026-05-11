// ============================================================
// context/AuthContext.jsx — Stato globale dell'autenticazione
// ============================================================
// React Context ci permette di condividere lo stato dell'utente
// loggato con tutti i componenti dell'app senza passare props
// manualmente ad ogni livello (prop drilling).
//
// Espone:
//   utente  — il payload del JWT ({ id, email, ruolo, ... }) o null
//   token   — la stringa JWT grezza (per le richieste HTTP)
//   login   — salva il token e aggiorna lo stato
//   logout  — rimuove il token e resetta lo stato
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'

// Creiamo il context con valore di default null
const AuthContext = createContext(null)

// ── Decodifica JWT ────────────────────────────────────────────
// Il JWT è composto da tre parti separate da "."
// La seconda parte è il payload, codificato in Base64.
// Lo decodifichiamo senza librerie esterne.
//
// ATTENZIONE: non stiamo VERIFICANDO la firma (quello lo fa il server),
// stiamo solo LEGGENDO i dati per uso client (es. mostrare il nome utente).
function decodeJWT(token) {
  try {
    // Sostituiamo i caratteri Base64Url → Base64 standard
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

// ── Provider ──────────────────────────────────────────────────
// Avvolge l'intera app e rende disponibile il context a tutti i figli
export function AuthProvider({ children }) {

  // Inizializziamo lo stato leggendo dal localStorage
  // (così dopo un refresh di pagina l'utente rimane loggato)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [utente, setUtente] = useState(() => {
    const t = localStorage.getItem('token')
    return t ? decodeJWT(t) : null
  })

  // Controlla se il token è scaduto all'avvio
  useEffect(() => {
    if (token) {
      const payload = decodeJWT(token)
      if (!payload || payload.exp * 1000 < Date.now()) {
        logout()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Ascolta l'evento 'auth:unauthorized' emesso da api.js quando
  // il server risponde 401 (token scaduto/revocato durante la sessione)
  useEffect(() => {
    const handleUnauthorized = () => logout()
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Chiamata dopo un login riuscito: salva il token e legge il payload
  const login = (nuovoToken) => {
    localStorage.setItem('token', nuovoToken)
    setToken(nuovoToken)
    setUtente(decodeJWT(nuovoToken))
  }

  // Chiamata al logout: pulizia completa
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUtente(null)
  }

  return (
    <AuthContext.Provider value={{ token, utente, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook personalizzato ───────────────────────────────────────
// Invece di scrivere useContext(AuthContext) ovunque,
// usiamo questo hook che ha un nome più leggibile.
export function useAuth() {
  return useContext(AuthContext)
}