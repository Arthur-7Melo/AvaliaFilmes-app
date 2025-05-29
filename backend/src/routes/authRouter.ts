import { Router } from "express";
import { signin, signup } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserSchema, signinSchema } from "../db/schemas/userSchema";

const router = Router();

router.post("/signup", validateRequest(createUserSchema), signup);
router.post("/signin", validateRequest(signinSchema), signin);

export default router;