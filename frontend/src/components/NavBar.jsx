import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        bgcolor: 'primary.dark',
        color: 'common.white',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ display: 'flex', alignItems: 'baseline', fontWeight: 'bold' }}
        >
          <Box
            component="span"
            sx={{
              color: 'secondary.main',
              fontSize: '1.8rem',
            }}
          >
            A
          </Box>
          <Box component="span" sx={{ letterSpacing: 0.5 }}>
            valia
          </Box>
          <Box
            component="span"
            sx={{
              color: 'secondary.main',
              fontSize: '1.8rem'
            }}
          >
            F
          </Box>
          <Box component="span" sx={{ letterSpacing: 0.5 }}>
            ilmes
          </Box>
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">
            Olá, <strong>{user.name}</strong>
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={logout}
            sx={{
              borderColor: 'common.white',
              color: 'common.white',
              '&:hover': {
                bgcolor: 'primary.light',
                borderColor: 'primary.light',
              },
            }}
          >
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
