// ============================================================
// pages/AdminPage.jsx — Dashboard amministratore
// ============================================================
// Accessibile solo agli utenti con ruolo 'admin'.
// Permette di aggiungere, modificare ed eliminare i libri
// e offre una panoramica rapida dello stato della biblioteca.
// ============================================================

import { useState, useEffect } from 'react'
import { libriAPI, prestitiAPI, importAPI } from '../services/api'

const ANNO_CORRENTE = new Date().getFullYear()

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

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ emoji, valore, label, colore }) {
  return (
    <div className={`stat-card stat-${colore}`}>
      <span className="stat-emoji">{emoji}</span>
      <span className="stat-valore">{valore}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

// ── Form libro ────────────────────────────────────────────────
const FORM_VUOTO = {
  titolo: '', autore: '', isbn: '',
  anno_pubblicazione: '', genere: '', quantita: 1,
}

function FormLibro({ iniziale, onSalva, onAnnulla }) {
  const [form, setForm]         = useState(iniziale || FORM_VUOTO)
  const [errore, setErrore]     = useState(null)
  const [loading, setLoading]   = useState(false)

  const isModifica = !!iniziale?.id

  const set = (campo, valore) => setForm(prev => ({ ...prev, [campo]: valore }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrore(null)
    setLoading(true)
    try {
      const payload = {
        titolo: form.titolo,
        autore: form.autore,
        ...(form.isbn               && { isbn: form.isbn }),
        ...(form.anno_pubblicazione && { anno_pubblicazione: parseInt(form.anno_pubblicazione) }),
        ...(form.genere             && { genere: form.genere }),
        ...(form.quantita           && { quantita: parseInt(form.quantita) }),
      }
      await onSalva(payload)
      // Per la modifica non resettiamo perché il modal si chiude da solo.
      if (!isModifica) setForm(FORM_VUOTO)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-libro">
      {errore && <div className="alert alert-error">⚠️ {errore}</div>}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Titolo *</label>
          <input
            type="text"
            value={form.titolo}
            onChange={e => set('titolo', e.target.value)}
            placeholder="Il nome della rosa"
            className="form-input"
            required maxLength={255}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Autore *</label>
          <input
            type="text"
            value={form.autore}
            onChange={e => set('autore', e.target.value)}
            placeholder="Umberto Eco"
            className="form-input"
            required maxLength={255}
          />
        </div>
      </div>

      <div className="form-row form-row-3">
        <div className="form-group">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            value={form.isbn}
            onChange={e => set('isbn', e.target.value)}
            placeholder="978-88-452-0011-6"
            className="form-input"
            maxLength={20}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Anno pubblicazione</label>
          <input
            type="number"
            value={form.anno_pubblicazione}
            onChange={e => set('anno_pubblicazione', e.target.value)}
            placeholder={String(ANNO_CORRENTE)}
            className="form-input"
            min={1000} max={ANNO_CORRENTE}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Quantità</label>
          <input
            type="number"
            value={form.quantita}
            onChange={e => set('quantita', e.target.value)}
            className="form-input"
            min={1}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Genere</label>
        <input
          type="text"
          value={form.genere}
          onChange={e => set('genere', e.target.value)}
          placeholder="Romanzo storico, Fantascienza…"
          className="form-input"
          maxLength={100}
        />
      </div>

      <div className="form-azioni">
        {onAnnulla && (
          <button type="button" className="btn-ghost" onClick={onAnnulla}>
            Annulla
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Salvataggio…' : isModifica ? 'Salva modifiche' : '+ Aggiungi libro'}
        </button>
      </div>
    </form>
  )
}

// ── Riga libro nella tabella ──────────────────────────────────
function RigaLibro({ libro, onModifica, onElimina }) {
  return (
    <tr>
      <td>
        <span className="libro-titolo-tabella">{libro.titolo}</span>
        {libro.genere && <span className="badge-genere-sm">{libro.genere}</span>}
      </td>
      <td>{libro.autore}</td>
      <td className="td-center">{libro.anno_pubblicazione || '—'}</td>
      <td className="td-center isbn-cell">{libro.isbn || '—'}</td>
      <td className="td-center">
        <span className={libro.quantita > 0 ? 'qta-ok' : 'qta-zero'}>
          {libro.quantita}
        </span>
      </td>
      <td className="td-azioni">
        <button className="btn-sm btn-secondary" onClick={() => onModifica(libro)}>
          Modifica
        </button>
        <button className="btn-sm btn-danger" onClick={() => onElimina(libro.id)}>
          Elimina
        </button>
      </td>
    </tr>
  )
}

// ── Modal modifica ────────────────────────────────────────────
function ModalModifica({ libro, onSalva, onAnnulla }) {
  return (
    <div className="modal-overlay" onClick={onAnnulla}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Modifica libro</h3>
        <p className="modal-sub">"{libro.titolo}"</p>
        <FormLibro
          iniziale={libro}
          onSalva={onSalva}
          onAnnulla={onAnnulla}
        />
      </div>
    </div>
  )
}

// ── Risultato import CSV ──────────────────────────────────────
function RisultatoImport({ dati, onChiudi }) {
  return (
    <div className="import-risultato">
      <div className="import-stats">
        <span className="import-stat ok">✅ {dati.inseriti} inseriti</span>
        <span className="import-stat skip">⏭️ {dati.saltato.length} saltati</span>
        <span className="import-stat err">❌ {dati.errori.length} errori</span>
      </div>
      {dati.saltato.length > 0 && (
        <details className="import-dettagli">
          <summary>Saltati ({dati.saltato.length})</summary>
          <ul>{dati.saltato.map((s, i) => <li key={i}><strong>{s.titolo}</strong>: {s.motivo}</li>)}</ul>
        </details>
      )}
      {dati.errori.length > 0 && (
        <details className="import-dettagli">
          <summary>Errori ({dati.errori.length})</summary>
          <ul>{dati.errori.map((e, i) => <li key={i}><strong>{e.titolo}</strong>: {e.motivo}</li>)}</ul>
        </details>
      )}
      <button className="btn-ghost" onClick={onChiudi}>Chiudi</button>
    </div>
  )
}

// ── Form import CSV ───────────────────────────────────────────
function FormImportCSV({ onImportato, mostraToast }) {
  const [file, setFile]               = useState(null)
  const [loading, setLoading]         = useState(false)
  const [risultato, setRisultato]     = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setRisultato(null)
    try {
      const dati = await importAPI.importaCSV(file)
      setRisultato(dati)
      if (dati.inseriti > 0) onImportato()   // ricarica la lista libri
      mostraToast(`Import completato: ${dati.inseriti} libri aggiunti`)
      setFile(null)
      e.target.reset()
    } catch (err) {
      mostraToast(err.message, 'errore')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sezione-admin">
      <h2 className="section-title">📥 Import massivo CSV</h2>
      <p className="form-hint" style={{ marginBottom: '1rem' }}>
        Il CSV deve avere l'intestazione: <code>titolo,autore,isbn,anno_pubblicazione,genere,quantita</code>
      </p>
      <form onSubmit={handleSubmit} className="form-import">
        <input
          type="file"
          accept=".csv"
          className="form-input"
          onChange={e => setFile(e.target.files[0] || null)}
          required
        />
        <button type="submit" className="btn-primary" disabled={loading || !file}>
          {loading ? 'Import in corso…' : 'Importa'}
        </button>
      </form>
      {risultato && (
        <RisultatoImport dati={risultato} onChiudi={() => setRisultato(null)} />
      )}
    </div>
  )
}

// ── Componente principale ─────────────────────────────────────
export default function AdminPage() {
  const [libri, setLibri]               = useState([])
  const [prestiti, setPrestiti]         = useState([])
  const [caricamento, setCaricamento]   = useState(true)
  const [toast, setToast]               = useState(null)
  const [libroModifica, setLibroModifica] = useState(null)
  const [ricerca, setRicerca]           = useState('')

  const mostraToast = (messaggio, tipo = 'successo') => setToast({ messaggio, tipo })

  useEffect(() => {
    Promise.all([libriAPI.getAll(), prestitiAPI.getAll()])
      .then(([l, p]) => { setLibri(l); setPrestiti(p) })
      .catch(err => mostraToast(err.message, 'errore'))
      .finally(() => setCaricamento(false))
  }, [])

  // ── Stats ─────────────────────────────────────────────────
  const totaleLibri   = libri.length
  const totaleVolumi  = libri.reduce((acc, l) => acc + (l.quantita || 0), 0)
  const prestitiAttivi   = prestiti.filter(p => p.stato === 'attivo').length
  const prestitiRitardo  = prestiti.filter(p => p.stato === 'in_ritardo').length

  // ── Aggiungi libro ────────────────────────────────────────
  const handleAggiungi = async (payload) => {
    // Nota: handleAggiungi viene chiamato da FormLibro che ha il proprio
    // try/catch e mostra l'errore inline. Qui rilanciamo per permetterlo.
    const nuovoLibro = await libriAPI.crea(payload)
    setLibri(prev => [nuovoLibro, ...prev])
    mostraToast(`"${nuovoLibro.titolo}" aggiunto al catalogo`)
  }

  // ── Modifica libro ────────────────────────────────────────
  const handleModifica = async (payload) => {
    // Anche qui FormLibro gestisce l'errore inline: rilanciamo
    const aggiornato = await libriAPI.aggiorna(libroModifica.id, payload)
    setLibri(prev => prev.map(l => l.id === libroModifica.id ? aggiornato : l))
    setLibroModifica(null)
    mostraToast(`"${aggiornato.titolo}" aggiornato`)
  }

  // ── Elimina libro ─────────────────────────────────────────
  const handleElimina = async (id) => {
    const libro = libri.find(l => l.id === id)
    if (!window.confirm(`Eliminare "${libro?.titolo}" dal catalogo?`)) return
    try {
      await libriAPI.elimina(id)
      setLibri(prev => prev.filter(l => l.id !== id))
      mostraToast(`"${libro?.titolo}" eliminato`)
    } catch (err) {
      // Caso tipico: il libro ha prestiti attivi e il DB lancia un errore di FK
      mostraToast(err.message, 'errore')
    }
  }

  const libriFiltrati = libri.filter(l =>
    l.titolo.toLowerCase().includes(ricerca.toLowerCase()) ||
    l.autore.toLowerCase().includes(ricerca.toLowerCase())
  )

  // Ricarica la lista libri dopo un import CSV
  const ricaricaLibri = () => {
    libriAPI.getAll().then(setLibri).catch(err => mostraToast(err.message, 'errore'))
  }

  if (caricamento) return <div className="page"><div className="spinner" /></div>

  return (
    <div className="page">
      {toast && (
        <Toast
          messaggio={toast.messaggio}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      {libroModifica && (
        <ModalModifica
          libro={libroModifica}
          onSalva={handleModifica}
          onAnnulla={() => setLibroModifica(null)}
        />
      )}

      <header className="page-header">
        <h1 className="page-title">⚙️ Pannello Admin</h1>
        <p className="page-subtitle">Gestione catalogo e monitoraggio prestiti</p>
      </header>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="stats-grid">
        <StatCard emoji="📚" valore={totaleLibri}  label="Titoli in catalogo" colore="verde" />
        <StatCard emoji="📦" valore={totaleVolumi}  label="Volumi totali"      colore="oro" />
        <StatCard emoji="🟢" valore={prestitiAttivi}   label="Prestiti attivi"   colore="verde" />
        <StatCard emoji="🔴" valore={prestitiRitardo}  label="Prestiti in ritardo" colore="rosso" />
      </div>

      {/* ── Aggiungi libro ────────────────────────────────── */}
      <section className="section">
        <div className="sezione-admin">
          <h2 className="section-title">➕ Aggiungi libro</h2>
          <FormLibro onSalva={handleAggiungi} />
        </div>
      </section>

      {/* ── Import CSV ───────────────────────────────────── */}
      <section className="section">
        <FormImportCSV onImportato={ricaricaLibri} mostraToast={mostraToast} />
      </section>

      {/* ── Catalogo ─────────────────────────────────────── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">📖 Catalogo ({libri.length} titoli)</h2>
          <input
            type="text"
            placeholder="Cerca titolo o autore…"
            value={ricerca}
            onChange={e => setRicerca(e.target.value)}
            className="form-input search-input"
          />
        </div>

        {libriFiltrati.length === 0
          ? <p className="empty-state">Nessun libro trovato.</p>
          : (
            <div className="tabella-wrapper">
              <table className="tabella">
                <thead>
                  <tr>
                    <th>Titolo</th>
                    <th>Autore</th>
                    <th className="td-center">Anno</th>
                    <th className="td-center">ISBN</th>
                    <th className="td-center">Qtà</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {libriFiltrati.map(libro => (
                    <RigaLibro
                      key={libro.id}
                      libro={libro}
                      onModifica={setLibroModifica}
                      onElimina={handleElimina}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </section>
    </div>
  )
}