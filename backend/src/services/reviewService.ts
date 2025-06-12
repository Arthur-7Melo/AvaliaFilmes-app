import { Review, IReview } from "../models/Review";
import { BadRequestError } from "../utils/customError";

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