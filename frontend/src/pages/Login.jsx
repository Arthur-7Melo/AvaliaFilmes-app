import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, InputAdornment } from "@mui/material";
import { Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signIn } from "../services/authService";
import RateSVG from '../assets/rate.svg';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await signIn({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      if (error.response?.data?.error?.length > 0) {
        const zodMessages = error.response.data.error.map(err => err.message);
        setError(zodMessages.join(' | '));
      }
      else if (error.response?.data?.message) {
        setError(error.response.data.message);
      }
      else {
        setError('Falha ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-indigo-400 to-purple-300 items-center justify-center p-8">
        <img src={RateSVG} alt="Ilustração de avaliação" className="max-w-fullw-full max-w-xs md:max-w-md" />
      </div>

      <div className="flex flex-col w-full md:w-1/2 items-center justify-center p-6 bg-gray-200">
        <Box mb={4}>
          <Typography variant="h3" component="h1" className="text-center">
            <span className="text-indigo-600 text-5xl font-bold">A</span>valia
            <span className="text-indigo-600 text-5xl font-bold">F</span>ilmes
          </Typography>
          <Typography variant="subtitle1" className="text-center text-gray-600">
            Faça login para continuar
          </Typography>
        </Box>

        <Paper
          className="w-full max-w-md p-8"
          elevation={8}
          sx={{ borderRadius: 2 }}
        >
          {error && (
            <Typography color="error" className="mb-4 text-center font-medium">
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              size="small"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              size="small"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                      style={{ minWidth: 0, padding: 4 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#4F46E5",
                "&:hover": { backgroundColor: "#4338CA" }
              }}
              fullWidth
              disabled={loading}
              size="large"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Paper>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Não tem uma conta?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{
                color: '#4F46E5',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              Cadastre-se aqui
            </span>
          </Typography>
        </Box>
      </div>
    </div>
  )
}