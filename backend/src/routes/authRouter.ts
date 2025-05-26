import { Router } from "express";
import { createUser } from "../controllers/authController";

const router = Router();

router.post("/", createUser);

export default router;