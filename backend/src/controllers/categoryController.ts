import { CategoryService } from "../services/categoryService.js";
import type { Request, Response } from 'express';
import type { IdParams } from '../schemas/common.schema.js';
import type { CreateCategoryDto, UpdateCategoryDto } from '../schemas/category.schema.js';

export class CategoryController {
    private static categoryService = new CategoryService();

    static async create(req: Request<{}, any, CreateCategoryDto>, res: Response) {
    try {
      const newCategory = await CategoryController.categoryService.create(req.body);
      res.status(201).json(newCategory);
    } catch (error: any) {
      // Erro de duplicata
      if (error.message.includes('já existe')) {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request<IdParams, any, UpdateCategoryDto>, res: Response) {
    try {
      const categoryId = BigInt(req.params.id);
      const updatedCategory = await CategoryController.categoryService.update(categoryId, req.body);
      res.status(200).json(updatedCategory);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('já existe')) {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request<IdParams>, res: Response) {
    try {
      const categoryId = BigInt(req.params.id);
      const result = await CategoryController.categoryService.delete(categoryId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      // Erro de FK (itens associados)
      if (error.message.includes('associada a')) {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const categories = await CategoryController.categoryService.findAll();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message }); // Erro inesperado
    }
  }

  static async findById(req: Request<IdParams>, res: Response) {
    try {
      const categoryId = BigInt(req.params.id);
      const category = await CategoryController.categoryService.findById(categoryId);
      res.status(200).json(category);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

}