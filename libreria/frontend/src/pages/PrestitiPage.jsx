// ============================================================
// pages/PrestitiPage.jsx — Gestione prestiti
// ============================================================
// Utente normale: vede solo i propri prestiti
// Admin:          vede tutti i prestiti con nome utente
// ============================================================

import { useState, useEffect } from 'react'
import { prestitiAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

// ── Badge stato ───────────────────────────────────────────────
const STATO_CONFIG = {
  attivo:      { label: 'Attivo',      emoji: '🟢', classe: 'stato-attivo' },
  in_ritardo:  { label: 'In ritardo',  emoji: '🔴', classe: 'stato-ritardo' },
  restituito:  { label: 'Restituito',  emoji: '✅', classe: 'stato-restituito' },
}

function BadgeStato({ stato }) {
  const cfg = STATO_CONFIG[stato] || { label: stato, emoji: '—', classe: '' }
  return (
    <span className={`badge-stato ${cfg.classe}`}>
      {cfg.emoji} {cfg.label}
    </span>
  )
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ messaggio, tipo, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`toast toast-${tipo}`} onClick={onClose}>
      {tipo === 'successo' ? '✅' : '⚠️'} {messaggio}
    </div>
  )
}

// ── Riga prestito ─────────────────────────────────────────────
function RigaPrestito({ prestito, isAdmin, onRestituisci, onElimina }) {
  const [caricamento, setCaricamento] = useState(false)

  const handleRestituisci = async () => {
    setCaricamento(true)
    try { await onRestituisci(prestito.id) }
    finally { setCaricamento(false) }
  }

  const fmt = (data) =>
    data ? new Date(data).toLocaleDateString('it-IT') : '—'

  return (
    <tr className={prestito.stato === 'in_ritardo' ? 'riga-ritardo' : ''}>
      <td className="td-libro">
        <span className="libro-titolo-tabella">{prestito.libro_titolo}</span>
        <span className="libro-autore-tabella">{prestito.libro_autore}</span>
      </td>
      {isAdmin && (
        <td className="td-utente">
          <span className="utente-nome">{prestito.utente_nome}</span>
          <span className="utente-email-small">{prestito.utente_email}</span>
        </td>
      )}
      <td>{fmt(prestito.data_prestito)}</td>
      <td
        className={prestito.stato === 'in_ritardo' ? 'data-ritardo' : ''}
      >
        {fmt(prestito.data_restituzione_prevista)}
      </td>
      <td>{prestito.data_restituzione_effettiva ? fmt(prestito.data_restituzione_effettiva) : '—'}</td>
      <td><BadgeStato stato={prestito.stato} /></td>
      <td className="td-azioni">
        {prestito.stato !== 'restituito' && (
          <button
            className="btn-sm btn-secondary"
            onClick={handleRestituisci}
            disabled={caricamento}
          >
            {caricamento ? '…' : 'Restituisci'}
          </button>
        )}
        {isAdmin && (
          <button
            className="btn-sm btn-danger"
            onClick={() => onElimina(prestito.id)}
          >
            Elimina
          </button>
        )}
      </td>
    </tr>
  )
}

// ── Componente principale ─────────────────────────────────────
export default function PrestitiPage() {
  const { utente } = useAuth()
  const isAdmin = utente?.ruolo === 'admin'

  const [prestiti, setPrestiti]         = useState([])
  const [caricamento, setCaricamento]   = useState(true)
  const [errore, setErrore]             = useState(null)
  const [filtro, setFiltro]             = useState('tutti')   // tutti | attivo | in_ritardo | restituito
  const [toast, setToast]               = useState(null)

  useEffect(() => {
    prestitiAPI.getAll()
      .then(data => {
        // L'utente normale vede solo i propri prestiti
        const miei = isAdmin ? data : data.filter(p => p.utente_id === utente?.id)
        setPrestiti(miei)
      })
      .catch(err => setErrore(err.message))
      .finally(() => setCaricamento(false))
  }, [isAdmin, utente?.id])

  // Filtro tabs
  const prestitiFiltrati = filtro === 'tutti'
    ? prestiti
    : prestiti.filter(p => p.stato === filtro)

  // Conteggi per le tabs
  const conteggi = {
    tutti:      prestiti.length,
    attivo:     prestiti.filter(p => p.stato === 'attivo').length,
    in_ritardo: prestiti.filter(p => p.stato === 'in_ritardo').length,
    restituito: prestiti.filter(p => p.stato === 'restituito').length,
  }

  const handleRestituisci = async (id) => {
    try {
      await prestitiAPI.restituisci(id)
      setPrestiti(prev => prev.map(p =>
        p.id === id ? { ...p, stato: 'restituito', data_restituzione_effettiva: new Date().toISOString() } : p
      ))
      setToast({ messaggio: 'Libro restituito con successo', tipo: 'successo' })
    } catch (err) {
      setToast({ messaggio: err.message, tipo: 'errore' })
    }
  }

  const handleElimina = async (id) => {
    if (!window.confirm('Eliminare questo prestito definitivamente?')) return
    try {
      await prestitiAPI.elimina(id)
      setPrestiti(prev => prev.filter(p => p.id !== id))
      setToast({ messaggio: 'Prestito eliminato', tipo: 'successo' })
    } catch (err) {
      setToast({ messaggio: err.message, tipo: 'errore' })
    }
  }

  const TABS = [
    { key: 'tutti',      label: 'Tutti' },
    { key: 'attivo',     label: 'Attivi' },
    { key: 'in_ritardo', label: 'In ritardo' },
    { key: 'restituito', label: 'Restituiti' },
  ]

  return (
    <div className="page">
      {toast && (
        <Toast
          messaggio={toast.messaggio}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      <header className="page-header">
        <div className="header-content">
          <h1 className="page-title">📋 Prestiti</h1>
          <p className="page-subtitle">
            {isAdmin
              ? `${prestiti.length} prestiti totali nel sistema`
              : `${prestiti.length} prestiti nel tuo storico`}
          </p>
        </div>
      </header>

      {/* Tabs filtro */}
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab ${filtro === tab.key ? 'tab-active' : ''}`}
            onClick={() => setFiltro(tab.key)}
          >
            {tab.label}
            <span className="tab-count">{conteggi[tab.key]}</span>
          </button>
        ))}
      </div>

      {caricamento && <div className="spinner" />}
      {errore && <div className="alert alert-error">⚠️ {errore}</div>}

      {!caricamento && prestitiFiltrati.length === 0 && (
        <p className="empty-state">Nessun prestito in questa categoria.</p>
      )}

      {!caricamento && prestitiFiltrati.length > 0 && (
        <div className="tabella-wrapper">
          <table className="tabella">
            <thead>
              <tr>
                <th>Libro</th>
                {isAdmin && <th>Utente</th>}
                <th>Data prestito</th>
                <th>Scadenza prevista</th>
                <th>Data restituzione</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {prestitiFiltrati.map(p => (
                <RigaPrestito
                  key={p.id}
                  prestito={p}
                  isAdmin={isAdmin}
                  onRestituisci={handleRestituisci}
                  onElimina={handleElimina}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}