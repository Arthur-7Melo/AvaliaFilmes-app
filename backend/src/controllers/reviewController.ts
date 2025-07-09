import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { createReview, deleteReview, getReviewsByMovie, getReviewsByUser, updateReview } from "../services/reviewService";
import { CreateReviewInput, UpdateReviewInput } from "../db/schemas/reviewSchema";
import { getMovieDetails } from "../services/tmdbService";
import { tomovieResponse } from "../utils/responses/movieResponse";

export const createReviewHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const movieId = Number(req.params.movieId);
    const userId = req.user!.id;
    const { rating, content }: CreateReviewInput = req.body;

    const review = await createReview(movieId, userId, rating, content);
    res.status(201).json({
      success: true,
      review
    })
  } catch (error) {
    next(error);
  }
}

export const getReviewsByMovieHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movieId = Number(req.params.movieId);
    const reviews = await getReviewsByMovie(movieId);
    res.status(200).json({
      success: true,
      reviews
    })
  } catch (error) {
    next(error);
  }
}

export const getReviewsByUserHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const reviews = await getReviewsByUser(userId);

    const enriched = await Promise.all(
      reviews.map(async (r) => {
        try {
          const rawMovie = await getMovieDetails(r.movieId);
          const movie = tomovieResponse(rawMovie);
          return {
            _id: r._id,
            rating: r.rating,
            content: r.content,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            movie: {
              id: movie.id,
              title: movie.title,
            },
          };
        } catch (err: any) {
          return {
            _id: r._id,
            rating: r.rating,
            content: r.content,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            movie: {
              id: r.movieId,
              title: "Título indisponível",
            },
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      reviews: enriched,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReviewHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = req.params.id;

    const { rating, content }: UpdateReviewInput = req.body;
    const data: UpdateReviewInput = { rating, content };

    const review = await updateReview(reviewId, data);
    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
}

export const deleteReviewHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = req.params.id;
    await deleteReview(reviewId);
    res.status(200).json({
      success: true,
      message: "Review excluído"
    })
  } catch (error) {
    next(error);
  }
}