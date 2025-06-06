import axios from "axios";
import { NotFoundError } from "../utils/customError";

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = process.env.TMDB_URL;

export const tmdb = axios.create({
  baseURL: TMDB_URL,
  params: {
    api_key: TMDB_KEY,
    language: "pt-BR"
  }
});

export const getGenres = async () => {
  const response = await tmdb.get("/genre/movie/list");
  return response.data.genres;
}

export const discoverMovies = async ({
  genreId,
  releaseYear,
  page = 1,
}: {
  genreId?: number,
  releaseYear?: number,
  page?: number,
}) => {
  const params: Record<string, any> = { page };
  if (genreId) params.with_genres = genreId;
  if (releaseYear) params.primary_release_year = releaseYear;

  const response = await tmdb.get("/discover/movie", { params });
  return response.data;
}

export const getMovieDetails = async (movieId: number) => {
  const response = await tmdb.get(`/movie/${movieId}`);
  if (response?.status === 404) {
    throw new NotFoundError("Filme não encontrado")
  }
  return response.data;
}

export const searchMovie = async ({
  query,
  page = 1,
}: {
  query: string,
  page?: number,
}) => {
  const response = await tmdb.get("/search/movie", {
    params: { query, page }
  });
  return response.data;
}