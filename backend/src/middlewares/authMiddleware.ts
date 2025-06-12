import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { User } from "../models/User";
import { NotFoundError, UnathourizedError } from "../utils/customError";

interface JwtPayload {
  id: string;
  name: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    role: "user" | "admin";
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnathourizedError('Token ausente ou mal formatado');
    };

    const token = authHeader.split(' ')[1]!;

    let decodedRaw: string | jwt.JwtPayload;
    try {
      decodedRaw = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnathourizedError("Token expirado");
      }
      throw new UnathourizedError("Token inválido");
    }

    if (typeof decodedRaw === "string" || !decodedRaw.id) {
      throw new UnathourizedError("Token inválido");
    }

    const { id, name, role } = decodedRaw;
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new NotFoundError('Usuário não existe');
    }

    req.user = { id, name, role };
    next();
  } catch (error) {
    next(error)
  }
}