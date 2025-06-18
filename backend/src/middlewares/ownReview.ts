import { Response, NextFunction } from "express";
import { Review } from "../models/Review";
import { AuthRequest } from "./authMiddleware";

export const ownReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review não encontrado"
      });
      return;
    }

    if (review.author.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: "Não autorizado" });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}