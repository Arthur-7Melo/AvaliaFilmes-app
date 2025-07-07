import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button
} from '@mui/material';
import useGenres from '../hooks/useGenres';
import useDiscoverMovies from '../hooks/useDiscoverMovies';

export default function DiscoverPage() {
  const { data: genres = [], isLoading: loadingGenres } = useGenres();
  const [genreId, setGenreId] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const {
    data: movies = [],
    isLoading: loadingMovies,
    error: moviesError,
  } = useDiscoverMovies({ genreId, releaseYear: year, page });

  if (loadingGenres || loadingMovies) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  if (moviesError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">Erro ao carregar filmes</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="genre-label">Gênero</InputLabel>
          <Select
            labelId="genre-label"
            value={genreId}
            label="Gênero"
            onChange={e => { setGenreId(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Todos</MenuItem>
            {genres.map(g => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="year-label">Ano</InputLabel>
          <Select
            labelId="year-label"
            value={year}
            label="Ano"
            onChange={e => { setYear(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Todos</MenuItem>
            {Array.from({ length: 30 }, (_, i) => 2025 - i).map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {movies.map(movie => (
          <Box
            key={movie.id}
            sx={{
              flex: '1 1 100%',
              '@media (min-width:600px)': { flex: '1 1 48%' },
              '@media (min-width:900px)': { flex: '1 1 23%' },
              maxWidth: {
                xs: '100%',
                sm: '48%',
                md: '23%',
              }
            }}
          >
            <Card
              onClick={() => navigate(`/movies/${movie.id}`)}
              sx={{
                cursor: 'pointer',
                height: 360,
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { transform: 'scale(1.03)' },
                transition: 'transform 0.2s'
              }}
              elevation={3}
            >
              {movie.posterUrl && (
                <CardMedia
                  component="img"
                  image={movie.posterUrl}
                  alt={movie.title}
                  sx={{
                    height: 240,
                    objectFit: 'cover'
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" noWrap>
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.releaseDate?.slice(0, 4) ?? '----'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage(old => Math.max(old - 1, 1))}
        >
          Anterior
        </Button>
        <Typography sx={{ alignSelf: 'center' }}>
          Página {page}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setPage(old => old + 1)}
        >
          Próxima
        </Button>
      </Box>
    </Container>
  );
}
