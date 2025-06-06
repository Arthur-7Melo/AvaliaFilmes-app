import { Request, Response } from "express";
import { discoverMovies, getGenres, getMovieDetails, searchMovie } from "../services/tmdbService";
import { MovieResponse, tomovieResponse } from "../utils/responses/movieResponse";

export const getGenresHandler = async (req: Request, res: Response) => {
  try {
    const genres = await getGenres();
    res.status(200).json({
      success: true,
      genres
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno ao buscar gêneros"
    });
  };
};

export const discoverMoviesHandler = async (req: Request, res: Response) => {
  try {
    const genreId = req.query.genre ? Number(req.query.genre) : undefined;
    const releaseYear = req.query.year ? Number(req.query.year) : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;

    const movies = await discoverMovies({ genreId, releaseYear, page });
    const moviesResponse = movies.results.map(tomovieResponse);
    res.status(200).json({
      success: true,
      moviesResponse
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Erro ao buscar filmes"
    });
  }
};

export const movieDetailsHandler = async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.id);
    const data = await getMovieDetails(movieId);
    const movies: MovieResponse = tomovieResponse(data);
    res.status(200).json({
      success: true,
      movies
    })
  } catch (error: any) {
    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        message: "Filme não encontrado",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
};

export const searchMovieHandler = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    const sanitizedQuery = query.trim().toLowerCase();
    const page = req.query.page ? (Number(req.query.page)) : 1;
    const data = await searchMovie({ query: sanitizedQuery, page });
    const movies = data.results.map(tomovieResponse);
    res.status(200).json({
      success: true,
      movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor ao buscar filmes"
    })
  }
};