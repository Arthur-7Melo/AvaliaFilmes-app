import { Router } from "express";
import { discoverMoviesHandler, getGenresHandler, movieDetailsHandler, searchMovieHandler } from "../controllers/movieController";

const router = Router();

router.get("/genres", getGenresHandler);
router.get("/discover", discoverMoviesHandler);
router.get("/search", searchMovieHandler);
router.get("/:id", movieDetailsHandler);

export default router;