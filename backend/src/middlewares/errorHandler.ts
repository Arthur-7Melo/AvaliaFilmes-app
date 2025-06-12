import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/customError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return
  };

  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
  });
};