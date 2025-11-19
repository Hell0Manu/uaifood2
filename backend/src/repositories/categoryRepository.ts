import prisma from "../../prisma/prismaClient.js";

import type { Prisma, Category } from "@prisma/client";


export class CategoryRepository {
    async findAll(): Promise<Category[]> {
        return prisma.category.findMany();
    }

    async findById(id: bigint): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id },
        });
    }

    async findByDescription(description: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { description: { equals: description, mode: 'insensitive' } },
    });
    }

    async update(id: bigint, data: Prisma.CategoryUpdateInput): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data,
        });
    }

    async delete(id: bigint): Promise<void> {
        await prisma.category.delete({
            where: { id },
        });
    }

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        return prisma.category.create({
            data,
        });
    }

}