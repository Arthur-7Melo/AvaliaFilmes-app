import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Stack,
  Rating,
  Paper,
} from '@mui/material'
import useReviewsByMovie from '../hooks/useReviewsByMovie'

export default function ReviewsPage() {
  const { id: movieId } = useParams()
  const navigate = useNavigate()
  const {
    data: reviews = [],
    isLoading,
    error,
  } = useReviewsByMovie(movieId)

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">Erro ao carregar avaliações.</Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Voltar
      </Button>

      <Typography variant="h5" gutterBottom>
        Avaliações desse filme
      </Typography>

      {reviews.length === 0 ? (
        <Typography color="text.secondary">Ainda não há avaliações.</Typography>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {reviews.map(r => (
            <Paper key={r._id} sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">{r.author.name}</Typography>
                <Rating value={r.rating} readOnly size="small" />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {r.content}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {new Date(r.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => navigate(`/movies/${movieId}`)}
        >
          Deixe sua review
        </Button>
      </Box>
    </Container>
  )
}
