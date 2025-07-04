import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export default function useMovieDetail(id) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const [detailRes, statsRes] = await Promise.all([
        api.get(`/v1/movies/${id}`),
        api.get(`/v1/movies/${id}/ratings`)
      ])

      const movie = detailRes.data.movie
      const stats = statsRes.data.stats

      return {
        ...movie,
        averageRating: stats.average,
        totalRatings: stats.count
      }
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    enabled: Boolean(id),
  })
}
