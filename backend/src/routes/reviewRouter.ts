import { Router } from "express";
import { errorHandler } from "../middlewares/errorHandler";
import { protect } from "../middlewares/authMiddleware";
import { createReviewHandler, getReviewsByMovieHandler, updateReviewHandler } from "../controllers/reviewController";
import { validateRequest } from "../middlewares/validateRequest";
import { createReviewSchema, reviewIdParamSchema, updateReviewSchema } from "../db/schemas/reviewSchema";
import { ownReview } from "../middlewares/ownReview";
import { validateParams } from "../middlewares/validateParams";

const router = Router();

router.get("/:movieId/reviews", getReviewsByMovieHandler);

router.use(protect);

router.post("/:movieId/reviews", validateRequest(createReviewSchema), createReviewHandler);
router.patch("/reviews/:id",
  validateParams(reviewIdParamSchema),
  ownReview,
  validateRequest(updateReviewSchema),
  updateReviewHandler);

router.use(errorHandler);

export default router;