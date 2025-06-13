import { UpdateReviewInput } from "../db/schemas/reviewSchema";
import { Review, IReview } from "../models/Review";
import { BadRequestError, NotFoundError } from "../utils/customError";

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