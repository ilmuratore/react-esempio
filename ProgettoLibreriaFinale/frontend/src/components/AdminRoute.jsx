// ============================================================
// components/AdminRoute.jsx — Protezione rotte admin
// ============================================================
// Come ProtectedRoute, ma controlla anche il ruolo.
//   - Non loggato → /login
//   - Loggato ma non admin → / (home)
//   - Admin → mostra la pagina
// ============================================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { utente } = useAuth()

  if (!utente)                    return <Navigate to="/login" replace />
  if (utente.ruolo !== 'admin')   return <Navigate to="/" replace />

  return children
}