import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

async function postReview({ movieId, rating, content }) {
  const { data } = await api.post(`/v1/${movieId}/reviews`, { rating, content })
  return data.review
}

export default function useCreateReview(movieId) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ rating, content }) => postReview({ movieId, rating, content }),
    onSuccess: () => {
      qc.invalidateQueries(['reviews', movieId])
    }
  })
}
