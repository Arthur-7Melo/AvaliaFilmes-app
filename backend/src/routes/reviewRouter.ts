import { Router } from "express";
import { errorHandler } from "../middlewares/errorHandler";
import { protect } from "../middlewares/authMiddleware";
import { createReviewHandler } from "../controllers/reviewController";
import { validateRequest } from "../middlewares/validateRequest";
import { createReviewSchema } from "../db/schemas/reviewSchema";

const router = Router();

router.use(protect);

router.post("/:movieId/reviews", validateRequest(createReviewSchema), createReviewHandler);

router.use(errorHandler);

export default router;