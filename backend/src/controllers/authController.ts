import { Request, Response } from "express";
import { createUser, forgotPassword, login } from "../services/authService";
import { CreateUserInput, ForgotPasswordInput, SignInInput } from "../db/schemas/userSchema";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/customError";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: CreateUserInput = req.body;
    const user = await createUser(name, email, password);
    res.status(201).json({
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

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password }: SignInInput = req.body;
    const token = await login(email, password);
    res.status(200).json({
      success: true,
      token,
    })
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { email }: ForgotPasswordInput = req.body;
    await forgotPassword(email);
    console.log(`Email enviado para o user: ${email}`);
    res.status(200).json({
      success: true,
      message: "Email enviado com sucesso"
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  }
}