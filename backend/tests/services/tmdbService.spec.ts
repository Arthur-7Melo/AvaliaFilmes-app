import { discoverMovies, getGenres, getMovieDetails, searchMovie, tmdb } from "../../src/services/tmdbService";

describe("tmdbService", () => {
  const spyGet = jest.spyOn(tmdb, "get");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGenres", () => {
    it("Deve chamar /genre/movie/list e retornar generos", async () => {
      const fakeGenres = [
        {
          id: 1,
          genero: "drama"
        },
        {
          id: 2,
          genero: "ação"
        }
      ];
      spyGet.mockResolvedValue({ data: { genres: fakeGenres } });

      const result = await getGenres();

      expect(spyGet).toHaveBeenCalledWith('/genre/movie/list');
      expect(result).toEqual(fakeGenres);
    });
  });

  describe("discoverMovies", () => {
    const fakeData = {
      page: 2,
      results: [{ id: 10, title: "Filme X" }],
      total_pages: 5,
      total_results: 50
    };

    it("Deve chamar /discover/movie apenas com page quando não há filtro",
      async () => {
        spyGet.mockResolvedValue({ data: fakeData });

        const result = await discoverMovies({});

        expect(spyGet).toHaveBeenCalledWith('/discover/movie', { params: { page: 1 } });
        expect(result).toEqual(fakeData);
      });

    it("Deve incluir genreId e releaseYear quando fornecidos", async () => {
      spyGet.mockResolvedValue({ data: fakeData });

      await discoverMovies({ genreId: 28, releaseYear: 2020, page: 3 });

      expect(spyGet).toHaveBeenCalledWith('/discover/movie', { params: { page: 3, with_genres: 28, primary_release_year: 2020 } });
    });
  });

  describe("getMovieDetails", () => {
    it("Deve chamar /movie/:movieId e retornar data", async () => {
      const fakeDetails = {
        id: 12,
        name: "Clube da luta",
        runtime: 139
      };
      spyGet.mockResolvedValue({ data: fakeDetails });

      const result = await getMovieDetails(12);

      expect(spyGet).toHaveBeenCalledWith('/movie/12');
      expect(result).toBe(fakeDetails);
    });
  });

  describe("searchMovie", () => {
    const fakeSearch = {
      page: 1,
      results: [{ id: 99, title: "Busca X" }],
      total_pages: 1,
      total_results: 1
    };

    it("Deve chamar /search/movie com query e page", async () => {
      spyGet.mockResolvedValue({ data: fakeSearch });

      const result = await searchMovie({ query: "teste", page: 2 });

      expect(spyGet).toHaveBeenCalledWith("/search/movie", {
        params: { query: "teste", page: 2 }
      });
      expect(result).toBe(fakeSearch);
    });

    it("Deve usar page = 1 como default", async () => {
      spyGet.mockResolvedValue({ data: fakeSearch });

      await searchMovie({ query: "example" });

      expect(spyGet).toHaveBeenCalledWith('/search/movie', {
        params: { query: "example", page: 1 }
      });
    });
  });
});