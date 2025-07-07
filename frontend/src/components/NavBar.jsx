import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AvaliaFilmes
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Olá, {user.name}</Typography>
          <Button onClick={logout}>Sair</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
