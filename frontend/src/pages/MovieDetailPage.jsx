import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Grid,
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Rating,
  Button,
  Skeleton,
  TextField
} from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import useMovieDetail from '../hooks/useMovieDetail'
import useCreateReview from '../hooks/useCreateReview'

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: movie,
    isLoading: loadingMovie,
    error: movieError
  } = useMovieDetail(id)

  const {
    mutate: createReview,
    isLoading: creatingReview
  } = useCreateReview(id)

  const [ratingValue, setRatingValue] = useState(0)
  const [comment, setComment] = useState('')
  const [formError, setFormError] = useState('')

  if (loadingMovie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={250} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton width="60%" height={40} />
            <Skeleton width="40%" />
            <Skeleton width="80%" />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="rectangular" height={40} width={120} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (movieError || !movie) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error">Não foi possível carregar o filme.</Typography>
      </Container>
    )
  }

  const onSubmitReview = (e) => {
    e.preventDefault()
    setFormError('')

    if (ratingValue < 1) {
      setFormError('Por favor, escolha uma nota de 1 a 5')
      return
    }

    createReview(
      { rating: ratingValue, content: comment },
      {
        onError: (err) => {
          setFormError(err.response?.data?.message || 'Erro ao enviar review')
        },
        onSuccess: () => {
          setRatingValue(0)
          setComment('')
          setFormError('')
        }
      }
    )
  }

  return (
    <Container
      sx={{
        mt: 4,
        bgcolor: 'background.paper',
        p: 3,
        borderRadius: 2
      }}
    >
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Voltar
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src={movie.backdropUrl}
            alt={movie.title}
            sx={{
              width: '100%',
              borderRadius: 2,
              objectFit: 'cover'
            }}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {movie.title} ({movie.releaseDate.slice(0, 4)})
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            {movie.genres.map((g) => (
              <Chip key={g} label={g} />
            ))}
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={movie.averageRating} precision={0.1} readOnly />
            <Typography sx={{ ml: 1 }} color="text.secondary">
              {movie.averageRating.toFixed(1)} ({movie.totalRatings})
            </Typography>
          </Box>

          <Typography variant="subtitle1" paragraph>
            Duração: {movie.runtime ?? '–'} min
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
            {movie.overview}
          </Typography>

          <Button
            variant="contained"
            startIcon={<RateReviewIcon />}
            onClick={() => navigate(`/movies/${movie.id}/reviews`)}
          >
            Ver Reviews
          </Button>
        </Grid>
      </Grid>

      <Box
        id="new-review-form"
        component="form"
        onSubmit={onSubmitReview}
        sx={{ mt: 4, mb: 4, maxWidth: 600 }}
      >
        <Typography variant="h6" gutterBottom>
          Deixe sua avaliação
        </Typography>

        {formError && (
          <Typography color="error" sx={{ mb: 1 }}>
            {formError}
          </Typography>
        )}

        <Rating
          name="rating"
          value={ratingValue}
          onChange={(_, v) => setRatingValue(v || 0)}
          precision={1}
          sx={{ mb: 1 }}
        />

        <TextField
          label="Comentário"
          fullWidth
          multiline
          minRows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={creatingReview}
        >
          {creatingReview ? 'Enviando...' : 'Enviar review'}
        </Button>
      </Box>
    </Container>
  )
}
