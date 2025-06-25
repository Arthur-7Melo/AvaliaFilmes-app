import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  InputAdornment,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signUp } from "../services/authService"; // supondo que exista
import RateSVG from "../assets/rate.svg";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((v) => !v);
  const toggleConfirmVisibility = () => setShowConfirm((v) => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("As senhas não são iguais");
      return;
    }
    setLoading(true);
    try {
      await signUp({ name, email, password });
      setSuccess("Usuário criado com sucesso. Redirecionando para o login...")
      setTimeout(() => {
        navigate('/login', {
          replace: true
        });
      }, 2000);
    } catch (err) {
      const payload = err.response?.data;
      if (payload?.error?.length) {
        setError(payload.error.map((e) => e.message).join(" | "));
      } else if (payload?.message) {
        setError(payload.message);
      } else {
        setError("Falha ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-indigo-400 to-purple-500 items-center justify-center p-8">
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
            Crie sua conta
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
              label="Nome"
              type="text"
              fullWidth
              required
              size="small"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

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
              {loading ? "Criando..." : "Criar conta"}
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
}
