import React from 'react'
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
  Skeleton
} from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import useMovieDetail from '../hooks/useMovieDetail'

export default function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: movie, isLoading, error } = useMovieDetail(id)

  if (isLoading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton width="60%" height={40} />
            <Skeleton width="40%" />
            <Skeleton width="80%" />
            <Skeleton width="50%" />
            <Box sx={{ mt: 2 }}><Skeleton variant="rectangular" height={40} width={120} /></Box>
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (error || !movie) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error">Não foi possível carregar o filme.</Typography>
      </Container>
    )
  }

  return (
    <Container
      sx={{
        mt: 4,
        bgcolor: 'background.paper',
        p: 3,
        borderRadius: 2,
      }}
    >
      <Button
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
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
              objectFit: 'cover',
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
            <Rating
              value={movie.averageRating}
              precision={0.1}
              readOnly
            />
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
    </Container>
  )
}
