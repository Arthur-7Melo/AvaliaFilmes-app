import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export default function useReviewsByMovie(movieId) {
  return useQuery({
    queryKey: ['reviews', movieId],
    queryFn: async () => {
      const { data } = await api.get(`/v1/${movieId}/reviews`)
      return data.reviews
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 2,
  })
}
