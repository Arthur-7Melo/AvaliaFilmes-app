import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import SignupPage from './pages/Register'
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetPasswordPage from './pages/ResetPassword'
import DiscoverPage from './pages/Discover'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/discover" element={<DiscoverPage />} />

      <Route
        path="*"
        element={
          localStorage.getItem('token')
            ? <Navigate to="/" replace />
            : <Navigate to="/discover" replace />
        }
      />
    </Routes>
  )
}

export default AppRoutes;