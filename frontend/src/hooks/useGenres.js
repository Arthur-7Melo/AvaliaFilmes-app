import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data } = await api.get('/v1/movies/genres')
      return data.genres
    },
    staleTime: 1000 * 60 * 5, 
  })
}