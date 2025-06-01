import { Router } from "express";
import { forgotPasswordHandler, resetPasswordHandler, signin, signup } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, signinSchema } from "../db/schemas/userSchema";

const router = Router();

router.post("/signup", validateRequest(createUserSchema), signup);
router.post("/signin", validateRequest(signinSchema), signin);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPasswordHandler);
router.post("/reset-password/:token", validateRequest(resetPasswordSchema), resetPasswordHandler);

export default router;