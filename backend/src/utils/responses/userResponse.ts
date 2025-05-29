import { IUser } from "../../models/User";

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
};

export function toUserResponse(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
};