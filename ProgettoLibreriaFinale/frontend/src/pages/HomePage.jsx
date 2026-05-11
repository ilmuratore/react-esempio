// ============================================================
// pages/HomePage.jsx — Pagina principale (protetta)
// ============================================================

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { libriAPI, prestitiAPI } from '../services/api'

function Spinner() {
  return <div className="spinner" aria-label="Caricamento…" />
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

// ── Card libro ────────────────────────────────────────────────
function LibroCard({ libro, onPrestito, isAdmin, onElimina }) {
  return (
    <div className="card libro-card">
      <div className="card-body">
        <h3 className="libro-titolo">{libro.titolo}</h3>
        <p className="libro-autore">✍️ {libro.autore}</p>
        {libro.genere && <span className="badge-genere">{libro.genere}</span>}
        <div className="libro-meta">
          {libro.anno_pubblicazione && <span>📅 {libro.anno_pubblicazione}</span>}
          {libro.isbn && <span className="isbn">ISBN: {libro.isbn}</span>}
        </div>
        <div className="libro-quantita">
          <span className={libro.quantita > 0 ? 'disponibile' : 'esaurito'}>
            {libro.quantita > 0
              ? `✅ ${libro.quantita} disponibil${libro.quantita === 1 ? 'e' : 'i'}`
              : '❌ Non disponibile'}
          </span>
        </div>
      </div>
      <div className="card-footer">
        <button
          className="btn-secondary"
          onClick={() => onPrestito(libro)}
          disabled={libro.quantita === 0}
        >
          Prendi in prestito
        </button>
        {isAdmin && (
          <button className="btn-danger" onClick={() => onElimina(libro.id)}>
            Elimina
          </button>
        )}
      </div>
    </div>
  )
}

// ── Card prestito ─────────────────────────────────────────────

const STATO_LABEL = {
  attivo:     '🟢 Attivo',
  in_ritardo: '🔴 In ritardo',
  restituito: '✅ Restituito',
}

function PrestitoCard({ prestito, onRestituisci, isAdmin, onElimina }) {
  return (
    <div className={`card prestito-card ${prestito.stato === 'in_ritardo' ? 'scaduto' : ''}`}>
      <div className="card-body">
        <h3 className="prestito-titolo">
          {prestito.libro_titolo || `Libro #${prestito.libro_id}`}
        </h3>
        <p className="prestito-info">
          📅 Preso il: {new Date(prestito.data_prestito).toLocaleDateString('it-IT')}
        </p>
        <p className="prestito-info">
          🔔 Restituzione entro:{' '}
          {new Date(prestito.data_restituzione_prevista).toLocaleDateString('it-IT')}
        </p>
        <span className={`badge-stato stato-${prestito.stato}`}>
          {STATO_LABEL[prestito.stato] ?? prestito.stato}
        </span>
      </div>
      <div className="card-footer">
        {prestito.stato !== 'restituito' && (
          <button className="btn-secondary" onClick={() => onRestituisci(prestito.id)}>
            Restituisci
          </button>
        )}
        {isAdmin && (
          <button className="btn-danger" onClick={() => onElimina(prestito.id)}>
            Elimina
          </button>
        )}
      </div>
    </div>
  )
}

// ── Modal nuovo prestito ──────────────────────────────────────
function ModalPrestito({ libro, onConferma, onAnnulla }) {
  const defaultData = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  const [data, setData]               = useState(defaultData)
  const [errore, setErrore]           = useState(null)
  const [caricamento, setCaricamento] = useState(false)

  const handleConferma = async () => {
    setErrore(null)
    setCaricamento(true)
    try {
      await onConferma(libro.id, data)
    } catch (err) {
      // L'errore arriva da handleNuovoPrestito e viene mostrato nel modal
      setErrore(err.message)
      setCaricamento(false)
    }
    // Nota: non serve setCaricamento(false) in finally:
    // se ha successo il modal si chiude (componente smontato)
  }

  return (
    <div className="modal-overlay" onClick={onAnnulla}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Nuovo prestito</h3>
        <p className="modal-sub">
          Stai prendendo in prestito: <strong>{libro.titolo}</strong>
        </p>
        {errore && <div className="alert alert-error">⚠️ {errore}</div>}
        <div className="form-group">
          <label className="form-label">Data di restituzione prevista</label>
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            className="form-input"
          />
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onAnnulla} disabled={caricamento}>
            Annulla
          </button>
          <button className="btn-primary" onClick={handleConferma} disabled={caricamento}>
            {caricamento ? 'Salvataggio…' : 'Conferma prestito'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principale ─────────────────────────────────────
export default function HomePage() {
  const { utente } = useAuth()
  const isAdmin = utente?.ruolo === 'admin'

  const [libri, setLibri]                             = useState([])
  const [prestiti, setPrestiti]                       = useState([])
  const [caricamentoLibri, setCaricamentoLibri]       = useState(true)
  const [caricamentoPrestiti, setCaricamentoPrestiti] = useState(true)
  const [erroreLibri, setErroreLibri]                 = useState(null)
  const [errorePrestiti, setErrorePrestiti]           = useState(null)
  const [libroSelezionato, setLibroSelezionato]       = useState(null)
  const [ricerca, setRicerca]                         = useState('')
  const [toast, setToast]                             = useState(null)

  const mostraToast = (messaggio, tipo = 'successo') => setToast({ messaggio, tipo })

  useEffect(() => {
    libriAPI.getAll()
      .then(setLibri)
      .catch(err => setErroreLibri(err.message))
      .finally(() => setCaricamentoLibri(false))
  }, [])

  useEffect(() => {
    prestitiAPI.getAll()
      .then(data => {
        const miei = isAdmin ? data : data.filter(p => p.utente_id === utente?.id)
        setPrestiti(miei)
      })
      .catch(err => setErrorePrestiti(err.message))
      .finally(() => setCaricamentoPrestiti(false))
  }, [isAdmin, utente?.id])

  const libriFiltrati = libri.filter(l =>
    l.titolo.toLowerCase().includes(ricerca.toLowerCase()) ||
    l.autore.toLowerCase().includes(ricerca.toLowerCase())
  )

  const mieiPrestiti = isAdmin ? prestiti : prestiti.filter(p => p.utente_id === utente?.id)

  // ── Handler prestito ──────────────────────────────────────
  const handleNuovoPrestito = async (libroId, dataRestituzione) => {
    try {
      const nuovoPrestito = await prestitiAPI.crea(libroId, dataRestituzione)
      const libro = libri.find(l => l.id === libroId)
      setPrestiti(prev => [...prev, {
        ...nuovoPrestito,
        libro_titolo: libro?.titolo,   // ← aggiunto manualmente dalla cache locale
        libro_autore: libro?.autore,
      }])
      setLibri(prev => prev.map(l =>
        l.id === libroId ? { ...l, quantita: l.quantita - 1 } : l
      ))
      setLibroSelezionato(null)
      mostraToast(`"${libro?.titolo}" aggiunto ai tuoi prestiti`)
    } catch (err) {
      // Rilanciamo: il ModalPrestito lo mostra inline senza chiudersi
      throw err
    }
  }

  const handleRestituisci = async (prestitoId) => {
    try {
      await prestitiAPI.restituisci(prestitoId)
      const prestito = prestiti.find(p => p.id === prestitoId)
      setPrestiti(prev => prev.map(p =>
        p.id === prestitoId ? { ...p, stato: 'restituito' } : p
      ))
      if (prestito) {
        setLibri(prev => prev.map(l =>
          l.id === prestito.libro_id ? { ...l, quantita: l.quantita + 1 } : l
        ))
      }
      mostraToast('Libro restituito con successo')
    } catch (err) {
      mostraToast(err.message, 'errore')
    }
  }

  const handleEliminaLibro = async (libroId) => {
    if (!window.confirm('Eliminare questo libro dal catalogo?')) return
    try {
      await libriAPI.elimina(libroId)
      setLibri(prev => prev.filter(l => l.id !== libroId))
      mostraToast('Libro eliminato dal catalogo')
    } catch (err) {
      mostraToast(err.message, 'errore')
    }
  }

  const handleEliminaPrestito = async (prestitoId) => {
    if (!window.confirm('Eliminare questo prestito?')) return
    try {
      await prestitiAPI.elimina(prestitoId)
      setPrestiti(prev => prev.filter(p => p.id !== prestitoId))
      mostraToast('Prestito eliminato')
    } catch (err) {
      mostraToast(err.message, 'errore')
    }
  }

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
        <h1 className="page-title">Ciao, {utente?.email?.split('@')[0]} 👋</h1>
        <p className="page-subtitle">
          {isAdmin
            ? 'Pannello amministratore — gestisci il catalogo e i prestiti'
            : 'Sfoglia il catalogo e gestisci i tuoi prestiti'}
        </p>
      </header>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">📖 Catalogo Libri</h2>
          <input
            type="text"
            placeholder="Cerca per titolo o autore…"
            value={ricerca}
            onChange={e => setRicerca(e.target.value)}
            className="form-input search-input"
          />
        </div>
        {caricamentoLibri && <Spinner />}
        {erroreLibri && <div className="alert alert-error">⚠️ {erroreLibri}</div>}
        {!caricamentoLibri && libriFiltrati.length === 0 && (
          <p className="empty-state">Nessun libro trovato.</p>
        )}
        <div className="card-grid">
          {libriFiltrati.map(libro => (
            <LibroCard
              key={libro.id}
              libro={libro}
              onPrestito={setLibroSelezionato}
              isAdmin={isAdmin}
              onElimina={handleEliminaLibro}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">
            {isAdmin ? '📋 Tutti i Prestiti' : '📋 I miei Prestiti'}
          </h2>
        </div>
        {caricamentoPrestiti && <Spinner />}
        {errorePrestiti && <div className="alert alert-error">⚠️ {errorePrestiti}</div>}
        {!caricamentoPrestiti && mieiPrestiti.length === 0 && (
          <p className="empty-state">Nessun prestito attivo.</p>
        )}
        <div className="card-grid">
          {mieiPrestiti.map(prestito => (
            <PrestitoCard
              key={prestito.id}
              prestito={prestito}
              onRestituisci={handleRestituisci}
              isAdmin={isAdmin}
              onElimina={handleEliminaPrestito}
            />
          ))}
        </div>
      </section>

      {libroSelezionato && (
        <ModalPrestito
          libro={libroSelezionato}
          onConferma={handleNuovoPrestito}
          onAnnulla={() => setLibroSelezionato(null)}
        />
      )}
    </div>
  )
}