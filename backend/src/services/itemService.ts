import { ItemRepository } from "../repositories/itemRepository.js";
import type { Item, Prisma } from "@prisma/client";
import { CategoryRepository } from "../repositories/categoryRepository.js"; // Importa o repo de Categoria
import type { CreateItemDto, UpdateItemDto } from "../schemas/item.schemas.js";



export class ItemService {
  private itemRepository = new ItemRepository();
  private categoryRepository = new CategoryRepository();

  async create(data: CreateItemDto): Promise<Item> {
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }
    
    const existing = await this.itemRepository.findByDescription(data.description);
    if (existing) {
      throw new Error("Um item com esta descrição já existe.");
    }

    const dataToSave: Prisma.ItemCreateInput = {
      description: data.description,
      unitPrice: data.unitPrice,
      category: {
        connect: {
          id: data.categoryId,
        },
      },
    };
    
    return this.itemRepository.create(dataToSave);
  }

  async update(id: bigint, data: UpdateItemDto): Promise<Item> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new Error("Item não encontrado.");
    }

    const dataToUpdate: Prisma.ItemUpdateInput = {};

    if (data.description) {
      if (data.description !== item.description) {
        const existing = await this.itemRepository.findByDescription(data.description);
        if (existing) {
          throw new Error("Um item com esta descrição já existe.");
        }
      }
      dataToUpdate.description = data.description;
    }
    if (data.unitPrice) dataToUpdate.unitPrice = data.unitPrice;
    


    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error("Categoria não encontrada.");
      }
      dataToUpdate.category = {
        connect: {
          id: data.categoryId,
        },
      };
    }

    return this.itemRepository.update(id, dataToUpdate);
  }

  async delete(id: bigint): Promise<{ message: string }> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new Error("Item não encontrado.");
    }
    
    const orderCount = await this.itemRepository.countOrderItems(id);
    if (orderCount > 0) {
      throw new Error(`Não é possível deletar. Este item está em ${orderCount} pedido(s).`);
    }

    await this.itemRepository.delete(id);
    return { message: "Item deletado com sucesso" };
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }

  async findById(id: bigint): Promise<Item> {
    const item = await this.itemRepository.findById(id);
    if (!item) {
      throw new Error("Item não encontrado.");
    }
    return item;
  }

  async findAllByCategoryId(categoryId: bigint): Promise<Item[]> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }
    
    return this.itemRepository.findAllByCategoryId(categoryId);
  }
}