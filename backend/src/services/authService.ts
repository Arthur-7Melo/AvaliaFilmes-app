import { User } from "../models/User";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/customError";
import { toUserResponse, UserResponse } from "../utils/responses/userResponse";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmailResetPassword } from "./emailService";

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

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new NotFoundError("Usuário não encontrado")
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new BadRequestError("Senha incorreta")
  }

  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  )
  return token;
}

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new NotFoundError("Usuário não encontrado")
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 3600000);

  await user.save();
  await sendEmailResetPassword(user.email, resetToken);
}