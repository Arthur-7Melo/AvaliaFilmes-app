import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { createReview } from "../services/reviewService";
import { CreateReviewInput } from "../db/schemas/reviewSchema";

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