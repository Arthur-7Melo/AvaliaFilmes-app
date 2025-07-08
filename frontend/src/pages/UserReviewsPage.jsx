import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Stack,
  Rating,
  Paper,
  IconButton,
  TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useReviewsByUser from '../hooks/useReviewsByUser';
import useDeleteReview from '../hooks/useDeleteReview';
import useUpdateReview from '../hooks/useUpdateReview';

export default function UserReviewsPage() {
  const { data: reviews = [], isLoading, error } = useReviewsByUser();
  const deleteReview = useDeleteReview();
  const updateReview = useUpdateReview();
  const [editingId, setEditingId] = useState(null);
  const [draftContent, setDraftContent] = useState('');
  const [draftRating, setDraftRating] = useState(0);
  const [formError, setFormError] = useState('');

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">Erro ao carregar avaliações.</Typography>
      </Container>
    );
  }

  const handleDelete = (id) => {
    deleteReview.mutate(id);
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    setDraftContent(r.content);
    setDraftRating(r.rating);
    setFormError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormError('');
  };

  const submitEdit = (id) => {
    if (draftRating < 1) {
      setFormError('Por favor, escolha uma nota de 1 a 5');
      return;
    }
    updateReview.mutate(
      { id, content: draftContent, rating: draftRating },
      {
        onSuccess: () => setEditingId(null),
        onError: (err) => setFormError(err.response?.data?.message || 'Erro ao atualizar'),
      }
    );
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Minhas Avaliações
      </Typography>

      {reviews.length === 0 ? (
        <Typography color="text.secondary">
          Você ainda não fez nenhuma avaliação.
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {reviews.map((r) => {
            const isEditing = editingId === r._id;
            return (
              <Paper
                key={r._id}
                sx={{ p: 2, position: 'relative', bgcolor: 'background.paper' }}
                elevation={3}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  {!isEditing ? (
                    <>
                      <IconButton size="small" onClick={() => startEdit(r)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(r._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Button size="small" onClick={() => submitEdit(r._id)}>
                        Salvar
                      </Button>
                      <Button size="small" onClick={cancelEdit}>
                        Cancelar
                      </Button>
                    </>
                  )}
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Filme avaliado: <strong>{r.movie.title}</strong>
                </Typography>

                {isEditing ? (
                  <>
                    {formError && (
                      <Typography color="error" sx={{ mb: 1 }}>
                        {formError}
                      </Typography>
                    )}
                    <Rating
                      value={draftRating}
                      onChange={(_, v) => setDraftRating(v || 0)}
                      precision={1}
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={r.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {r.rating} / 5
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      {r.content}
                    </Typography>
                  </>
                )}

                <Typography variant="caption" color="text.secondary">
                  {new Date(r.createdAt).toLocaleDateString()}
                </Typography>
              </Paper>
            );
          })}
        </Stack>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" href="/discover">
          Avaliar outro filme
        </Button>
      </Box>
    </Container>
  );
}
