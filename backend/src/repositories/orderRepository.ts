import prisma from "../../prisma/prismaClient.js";

import type { Prisma, Order, OrderStatus } from "@prisma/client";


export class OrderRepository {
    async findAll(): Promise<Order[]> {
        return prisma.order.findMany();
    }

    async findAllByUserId(userId: bigint): Promise<Order[]> {
        return prisma.order.findMany({
            where: { clientId: userId },
            include: {
                items: { // Inclui os 'OrderItems'
                    include: {
                        item: true, // Inclui os detalhes do 'Item' (nome, preço)
                    },
                },
                client: true, // Inclui os dados do cliente
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findById(id: bigint): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { id },
            include: {
                    items: {
                        include: {
                            item: true,
                    },
                },
                client: {
                    select: { id: true, name: true, email: true }
                }
            },
        });
    }

    async create(
        data: Prisma.OrderCreateInput, 
        tx: Prisma.TransactionClient
    ): Promise<Order> {
        return tx.order.create({
            data,
        });
    }

    async updateStatus(id: bigint, status: OrderStatus): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}