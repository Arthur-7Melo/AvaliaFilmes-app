import { Router } from "express";
import { signup } from "../controllers/authController";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserSchema } from "../db/schemas/userSchema";

const router = Router();

router.post("/signup", validateRequest(createUserSchema), signup);

export default router;