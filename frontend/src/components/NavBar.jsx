import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, useTheme, useMediaQuery } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

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
          <Typography variant="body1" sx={{ ml: 2 }}>
            Olá, <strong>{user.name}</strong>
          </Typography>

          <Button
            component={RouterLink}
            to="/me/reviews"
            variant="outlined"
            size="small"
            sx={{
              color: 'common.white',
              borderColor: 'common.white',
              '&:hover': {
                bgcolor: 'primary.light',
                borderColor: 'primary.light',
              },
            }}
          >
            Minhas Avaliações
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={logout}
            sx={{
              color: 'common.white',
              borderColor: 'common.white',
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
