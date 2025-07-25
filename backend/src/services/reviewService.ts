import { UpdateReviewInput } from "../db/schemas/reviewSchema";
import { Review, IReview } from "../models/Review";
import { BadRequestError, NotFoundError } from "../utils/customError";

export interface RatingStats {
  average: number;
  count: number;
}

export const createReview = async (
  movieId: number,
  userId: string,
  rating: number,
  content: string
): Promise<IReview> => {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    throw new BadRequestError("Id do filme é inválido");
  }

  const existing = await Review.findOne({ movieId, author: userId });
  if (existing) {
    throw new BadRequestError("Você já avaliou este filme")
  };

  const review = new Review({
    movieId,
    author: userId,
    rating,
    content
  });
  return review.save();
}

export const getReviewsByMovie = async (movieId: number): Promise<IReview[]> => {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    throw new BadRequestError("Id do filme é inválido");
  }

  return Review.find({ movieId })
    .sort({ createdAt: -1 })
    .populate("author", "name");
}

export const getReviewsByUser = async (userId: string): Promise<IReview[]> => {
  return Review.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate("author", "name")
}

export const updateReview = async (reviewId: string, data: UpdateReviewInput) => {
  const toSet: Partial<UpdateReviewInput> = {};
  if (data.rating !== undefined) {
    toSet.rating = data.rating;
  }
  if (data.content !== undefined) {
    toSet.content = data.content;
  }

  const review = await Review.findOneAndUpdate(
    { _id: reviewId },
    { $set: toSet },
    { new: true, runValidators: true });

  if (!review) {
    throw new NotFoundError("Review não encontrado");
  }

  return review;
}

export const deleteReview = async (reviewId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFoundError("Review não encontrado");
  }
  await review.deleteOne();
}

export const getRatingStats = async (movieId: number): Promise<RatingStats> => {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    throw new BadRequestError("Id do filme é inválido");
  }

  const result = await Review.aggregate<RatingStats>([
    { $match: { movieId } },
    {
      $group: {
        _id: null,
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      average: 0,
      count: 0
    }
  }
  const { average, count } = result[0];
  return { average, count };
}