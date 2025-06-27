import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper, Box, InputAdornment } from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { forgotPassword } from "../services/authService";
import RateSVG from '../assets/rate.svg';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess("Email de recuperação enviado. Verifique sua caixa de entrada")
    } catch (error) {
      if (error.response?.data?.error?.length > 0) {
        const zodMessages = error.response.data.error.map(err => err.message);
        setError(zodMessages.join(' | '));
      }
      else if (error.response?.data?.message) {
        setError(error.response.data.message);
      }
      else {
        setError('Erro ao enviar email. Tente novamente');
      }
    } finally {
      setLoading(false);
    }
  };

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
            Digite seu email para continuar
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
          {success && (
            <Typography className="mb-4 text-center font-medium"
              sx={{ color: '#22C55E' }}
            >
              {success}
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
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </Paper>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Lembrou sua conta?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{
                color: '#4F46E5',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              Faça Login
            </span>
          </Typography>
        </Box>
      </div>
    </div>
  )
}