import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export default function useSearchMovies({ query, genreId, releaseYear, page }) {
  return useQuery({
    queryKey: ['search', query, genreId, releaseYear, page],
    queryFn: async () => {
      const { data } = await api.get('/v1/movies/search', {
        params: {
          query: query.trim(),
          page,
          ...(genreId && { with_genres: genreId }),
          ...(releaseYear && { primary_release_year: releaseYear })
        }
      })
      return data.movies
    },
    enabled: Boolean(query && query.trim()),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  })
}