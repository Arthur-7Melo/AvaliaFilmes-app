import { User } from "../models/User";
import { ConflictError } from "../utils/customError";
import { toUserResponse, UserResponse } from "../utils/responses/userResponse";
import bcrypt from 'bcryptjs';

export const createUser = async (name: string, email: string, password: string):
  Promise<UserResponse> => {
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new ConflictError("Usuário já possui cadastro");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name, email,
    password: hashedPassword
  });

  return toUserResponse(user);
}