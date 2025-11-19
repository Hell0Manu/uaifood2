import prisma from "../../prisma/prismaClient.js";

import type { Prisma, Item } from "@prisma/client";


export class ItemRepository {
    async findAll(): Promise<Item[]> {
        return prisma.item.findMany({ include: { category: true } });
    }

    async countByCategoryId(categoryId: bigint): Promise<number> {
    return prisma.item.count({ where: { categoryId } });
    }
    
    async countOrderItems(itemId: bigint): Promise<number> {
    return prisma.orderItem.count({
      where: { itemId },
    });
    }

    async findAllByCategoryId(categoryId: bigint): Promise<Item[]> {
        return prisma.item.findMany({
            where: { categoryId },
            include: { category: true }
        })
    }

    async findByDescription(description: string): Promise<Item | null> {
        return prisma.item.findFirst({
            where: { description: { equals: description, mode: 'insensitive' } },
            include: { category: true }
        });
    }

    async findAllByInIds(ids: bigint[]): Promise<Item[]> {
        return prisma.item.findMany({
            where: { id: { in: ids } },
        });
    }

    async findById(id: bigint): Promise<Item | null> {
        return prisma.item.findUnique({
            where: { id },
            include: { category: true }
        });
    }

    async update(id: bigint, data: Prisma.ItemUpdateInput): Promise<Item> {
        return prisma.item.update({
            where: { id },
            data,
        });
    }

    async delete(id: bigint): Promise<void> {
        await prisma.item.delete({
            where: { id },
        });
    }

    async create(data: Prisma.ItemCreateInput): Promise<Item> {
        return prisma.item.create({
            data,
        });
    }

}