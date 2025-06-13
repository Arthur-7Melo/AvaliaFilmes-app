import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { createReview, getReviewsByMovie, updateReview } from "../services/reviewService";
import { CreateReviewInput, UpdateReviewInput } from "../db/schemas/reviewSchema";

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