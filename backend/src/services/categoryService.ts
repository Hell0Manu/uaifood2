import { CategoryRepository } from "../repositories/categoryRepository.js";
import { ItemRepository } from "../repositories/itemRepository.js";
import type { Prisma, Category } from "@prisma/client";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../schemas/category.schema.js";
import type { IAuthenticatedUser } from '../@types/express/index.js';

export class CategoryService {
  private categoryRepository = new CategoryRepository();
  private itemRepository = new ItemRepository();

  async create(data: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findByDescription(
      data.description
    );
    if (existing) {
      throw new Error("Uma categoria com esta descrição já existe.");
    }

    return this.categoryRepository.create(data);
  }

  async update(id: bigint, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    if (data.description && data.description !== category.description) {
      const existing = await this.categoryRepository.findByDescription(
        data.description as string
      );
      if (existing) {
        throw new Error("Uma categoria com esta descrição já existe.");
      }
    }

    return this.categoryRepository.update(id, data.description as Prisma.CategoryUpdateInput);
  }

  async delete(id: bigint): Promise<{ message: string }> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    const itemsCount = await this.itemRepository.countByCategoryId(id);
    if (itemsCount > 0) {
      throw new Error(
        `Não é possível deletar. Esta categoria está associada a ${itemsCount} item(ns).`
      );
    }

    await this.categoryRepository.delete(id);
    return { message: "Categoria deletada com sucesso" };
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: bigint): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }
    return category;
  }

}
