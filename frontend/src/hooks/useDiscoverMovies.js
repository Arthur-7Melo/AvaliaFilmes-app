import { useQuery } from "@tanstack/react-query";
import { api }       from "../services/api";

export default function useDiscoverMovies({ genreId, releaseYear, page }) {
  return useQuery({
    queryKey: ["discover", genreId, releaseYear, page],
    queryFn: async () => {
      const { data } = await api.get("/v1/movies/discover", {
        params: {
          page,
          ...(genreId && { genre: genreId }),
          ...(releaseYear && { year: releaseYear }),
        },
      });
      return Array.isArray(data.moviesResponse)
        ? data.moviesResponse
        : [];
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
  });
}
