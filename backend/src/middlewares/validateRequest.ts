import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatedError = error.errors.map((err) => ({
          message: err.message,
          field: err.path.join('.')
        }));
        res.status(400).json({
          success: false,
          error: formatedError
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Erro interno do servidor"
        });
      }
    }
  };