import { Request, Response } from "express";
import { createUser } from "../services/authService";
import { CreateUserInput } from "../db/schemas/userSchema";
import { ConflictError } from "../utils/customError";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: CreateUserInput = req.body;
    const user = await createUser(name, email, password);
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    if (error instanceof ConflictError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erro ao criar user"
      });
    }
  }
}