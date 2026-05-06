// ============================================================
// App.jsx — Rotte dell'applicazione
// ============================================================
// Rotte:
//   /           → HomePage     (protetta)
//   /prestiti   → PrestitiPage (protetta)
//   /admin      → AdminPage    (protetta + solo admin)
//   /login      → LoginPage    (pubblica)
//   /register   → RegisterPage (pubblica)
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute     from './components/AdminRoute'
import Navbar         from './components/Navbar'

import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage     from './pages/HomePage'
import PrestitiPage from './pages/PrestitiPage'
import AdminPage    from './pages/AdminPage'

export default function App() {
  const { utente } = useAuth()

  return (
    <>
      {utente && <Navbar />}

      <Routes>
        {/* Rotte pubbliche — redirect se già loggato */}
        <Route path="/login"    element={utente ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={utente ? <Navigate to="/" replace /> : <RegisterPage />} />

        {/* Rotte protette — redirect a /login se non autenticato */}
        <Route path="/" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />
        <Route path="/prestiti" element={
          <ProtectedRoute><PrestitiPage /></ProtectedRoute>
        } />

        {/* Rotta solo admin — redirect a / se non è admin */}
        <Route path="/admin" element={
          <AdminRoute><AdminPage /></AdminRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}