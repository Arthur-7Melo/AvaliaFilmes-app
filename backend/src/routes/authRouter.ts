import { Router } from "express";
import { forgotPasswordHandler, signin, signup } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserSchema, forgotPasswordSchema, signinSchema } from "../db/schemas/userSchema";

const router = Router();

router.post("/signup", validateRequest(createUserSchema), signup);
router.post("/signin", validateRequest(signinSchema), signin);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPasswordHandler);

export default router;