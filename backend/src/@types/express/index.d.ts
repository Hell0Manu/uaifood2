import { UserType } from "@prisma/client";

export interface IAuthenticatedUser {
  id: bigint;
  role: UserType;
}

declare global {
  declare namespace Express {
    export interface Request {
      user: IAuthenticatedUser;
    }
  }
}