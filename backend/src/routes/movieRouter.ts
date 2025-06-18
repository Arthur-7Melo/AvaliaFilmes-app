import { Router } from "express";
import { discoverMoviesHandler, getGenresHandler, getRatingStatsHandler, movieDetailsHandler, searchMovieHandler } from "../controllers/movieController";

const router = Router();

router.get("/genres", getGenresHandler);
router.get("/discover", discoverMoviesHandler);
router.get("/search", searchMovieHandler);
router.get("/:id", movieDetailsHandler);
router.get("/:id/ratings", getRatingStatsHandler);

export default router;