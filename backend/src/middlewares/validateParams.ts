import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validateParams =
  (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = schema.parse(req.params);
        req.params = result;
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          const formatedError = err.errors.map(e => ({
            message: e.message,
            field: e.path.join(".")
          }));
          res.status(400).json({
            success: false,
            error: formatedError
          });
          return;
        }
        res.status(500).json({
          success: false,
          message: "Erro interno do servidor"
        });
        return;
      }
    };