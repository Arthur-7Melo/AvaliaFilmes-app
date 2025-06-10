import request from "supertest";
import app from "../../src/app";
import * as tmdbService from '../../src/services/tmdbService';

jest.mock("../../src/services/tmdbService");

describe("movieController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/v1/movies/genres", () => {
    it("Deve retornar status 200 e lista de gêneros", async () => {
      const fakeGenres = [
        {
          id: 1,
          name: "drama"
        },
        {
          id: 2,
          name: "ação"
        }
      ];
      (tmdbService.getGenres as jest.Mock).mockResolvedValue(fakeGenres);

      const response = await request(app).get("/api/v1/movies/genres");

      expect(tmdbService.getGenres).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        genres: fakeGenres
      });
    });

    it("Deve retornar status 500 e Error", async () => {
      (tmdbService.getGenres as jest.Mock).mockRejectedValue(new Error("fail"));

      const response = await request(app).get("/api/v1/movies/genres");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Erro interno ao buscar gêneros"
      });
    });
  });

  describe("GET /api/v1/movies/discover", () => {
    const rawMovie = {
      id: 10,
      title: "X",
      overview: "desc",
      poster_path: "/p.jpg",
      backdrop_path: "/b.jpg",
      original_title: "X",
      genres: [{ id: 1, name: "Ação" }],
      release_date: "2020-01-01",
      runtime: 100,
      vote_average: 7.5,
      vote_count: 100,
    };
    const fakeData = { results: [rawMovie] };

    it("Deve retornar status 200 e objeto movieResponse", async () => {
      (tmdbService.discoverMovies as jest.Mock).mockResolvedValue(fakeData);

      const response = await request(app)
        .get("/api/v1/movies/discover")
        .query({ genre: "1", year: "2020", page: "2" });

      expect(tmdbService.discoverMovies).toHaveBeenCalledWith({
        genreId: 1, releaseYear: 2020, page: 2
      });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.moviesResponse)).toBe(true);
    });

    it("Deve retornar status 500 e Error", async () => {
      (tmdbService.discoverMovies as jest.Mock).mockRejectedValue(new Error('fail'));

      const response = await request(app).get("/api/v1/movies/discover");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Erro ao buscar filmes"
      });
    });
  });

  describe("GET /api/v1/movies/search", () => {
    const rawMovie = {
      id: 30,
      title: "Z",
      overview: "descZ",
      poster_path: "/z.jpg",
      backdrop_path: "/zb.jpg",
      original_title: "Z",
      genres: [{ id: 3, name: "Comédia" }],
      release_date: "2022-03-03",
      runtime: 90,
    };
    const fakeData = { results: [rawMovie] };

    it("Deve retornar status 200 e filmes quando query válida fornecida",
      async () => {
        (tmdbService.searchMovie as jest.Mock).mockResolvedValue(fakeData);

        const response = await request(app)
          .get("/api/v1/movies/search")
          .query({ query: "z", page: "3" });

        expect(tmdbService.searchMovie).toHaveBeenCalledWith({
          query: "z", page: 3
        });
        expect(response.status).toBe(200);
        expect(response.body.movies[0]).toMatchObject({
          id: 30,
          title: "Z",
        });
      });

    it("Deve retornar status 500 e Error", async () => {
      (tmdbService.searchMovie as jest.Mock).mockRejectedValue(new Error('fail'));

      const response = await request(app)
        .get("/api/v1/movies/search")
        .query({ query: "z" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Erro interno do servidor ao buscar filmes"
      });
    });
  });

  describe("GET /api/v1/movies/:id", () => {
    const rawDetail = {
      id: 20,
      title: "Y",
      overview: "descY",
      poster_path: "/y.jpg",
      backdrop_path: "/yb.jpg",
      original_title: "Y",
      genres: [{ id: 2, name: "Drama" }],
      release_date: "2021-02-02",
      runtime: 120,
    };

    it("Deve retornar status 200 e filme quando encontrado", async () => {
      (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(rawDetail);

      const response = await request(app).get("/api/v1/movies/20");

      expect(tmdbService.getMovieDetails).toHaveBeenCalledWith(20);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.movie).toMatchObject({
        id: 20,
        title: "Y",
        overview: "descY",
        posterUrl: expect.stringContaining("/y.jpg"),
        backdropUrl: expect.stringContaining("/yb.jpg"),
        genres: ["Drama"],
        releaseDate: "2021-02-02",
        runtime: 120,
      });
    });

    it("Deve retornar status 404 quando o tmdb retornar 404", async () => {
      const err: any = new Error();
      err.response = { status: 404 };
      (tmdbService.getMovieDetails as jest.Mock).mockRejectedValue(err);

      const response = await request(app).get("/api/v1/movies/9999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Filme não encontrado"
      });
    });

    it("Deve retornar status 500 e Error", async () => {
      (tmdbService.getMovieDetails as jest.Mock).mockRejectedValue(new Error('fail'));

      const response = await request(app).get("/api/v1/movies/20");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Erro interno do servidor",
      });
    });
  });
});
