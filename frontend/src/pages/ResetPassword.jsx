import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
} from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import RateSVG from "../assets/rate.svg";
import { api } from "../services/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { token = '' } = useParams();

  const togglePasswordVisibility = () => setShowPassword((v) => !v);
  const toggleConfirmVisibility = () => setShowConfirm((v) => !v);

  useEffect(() => {
    if (!token) {
      setError("Token Inválido")
      navigate('/login');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("As senhas não são iguais");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess("Senha atualizada com sucesso. Você pode fazer o login");
      setTimeout(() => {
        navigate('/login', {
          replace: true
        });
      }, 2000);
    } catch (error) {
      if (error.response?.data?.error?.length > 0) {
        const zodMessages = error.response.data.error.map(err => err.message);
        setError(zodMessages.join(' | '));
      }
      else if (error.response?.data?.message) {
        setError(error.response.data.message);
      }
      else {
        setError('Falha ao redefinir senha. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-indigo-400 to-purple-300 items-center justify-center p-8">
        <img
          src={RateSVG}
          alt="Ilustração de avaliação"
          className="w-full max-w-xs md:max-w-md"
        />
      </div>

      <div className="flex flex-col w-full md:w-1/2 items-center justify-center p-6 bg-gray-200">
        <Box mb={4}>
          <Typography variant="h3" component="h1" className="text-center">
            <span className="text-indigo-600 text-5xl font-bold">A</span>valia
            <span className="text-indigo-600 text-5xl font-bold">F</span>ilmes
          </Typography>
          <Typography variant="subtitle1" className="text-center text-gray-600">
            Digite sua nova senha
          </Typography>
        </Box>

        <Paper className="w-full max-w-md p-8" elevation={8} sx={{ borderRadius: 2 }}>
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
                ),
              }}
            />

            <TextField
              label="Confirme a Senha"
              type={showConfirm ? "text" : "password"}
              fullWidth
              required
              size="small"
              margin="normal"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={toggleConfirmVisibility}
                      edge="end"
                      size="small"
                      style={{ minWidth: 0, padding: 4 }}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#4F46E5",
                "&:hover": { backgroundColor: "#4338CA" },
              }}
              fullWidth
              disabled={loading}
              size="large"
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  )
}