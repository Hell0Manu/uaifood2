import prisma from "../../prisma/prismaClient.js";

import type { Prisma, Address } from "@prisma/client";

export class AddressRepository {
    async findAll(): Promise<Address[]> {
        return prisma.address.findMany();
    }

    async findById(id: bigint): Promise<Address | null> {
        return prisma.address.findUnique({
            where: { id },
        });
    }

    async findAllByUserId(id: bigint): Promise<Address[]>{
        return prisma.address.findMany({
            where: { id },
        });
    }

    async update(id: bigint, data: Prisma.AddressUpdateInput): Promise<Address> {
        return prisma.address.update({
            where: { id },
            data,
        });
    }

    async delete(id: bigint): Promise<void> {
        await prisma.address.delete({
            where: { id },
        });
    }

    async create(data: Prisma.AddressCreateInput): Promise<Address> {
        return prisma.address.create({
            data,
        });
    }
    
}