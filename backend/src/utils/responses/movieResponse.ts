export interface MovieResponse {
  id: number;
  title: string;
  overview: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  genres: string[];
  releaseDate: string;
  runtime: number | null;
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function tomovieResponse(raw: any): MovieResponse {
  const posterPath: string | null = raw.poster_path ?? null;
  const backdropPath: string | null = raw.backdrop_path ?? null;

  return {
    id: raw.id,
    title: raw.title ?? raw.original_title ?? "Título desconhecido",
    overview: raw.overview ?? null,
    posterUrl: posterPath ? `${IMAGE_BASE_URL}${posterPath}` : null,
    backdropUrl: backdropPath ? `${IMAGE_BASE_URL}${backdropPath}` : null,
    genres: Array.isArray(raw.genres)
      ? raw.genres.map((g: any) => g.name)
      : [],
    releaseDate: raw.release_date ?? "0000-00-00",
    runtime: typeof raw.runtime === 'number' ? raw.runtime : null,
  };
}