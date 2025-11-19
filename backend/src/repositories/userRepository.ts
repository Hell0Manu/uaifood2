import prisma from "../../prisma/prismaClient.js";

import type { Prisma, User } from "@prisma/client";

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: bigint): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: bigint, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
}
