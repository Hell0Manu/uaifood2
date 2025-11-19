import type { Request, Response } from 'express';
import { ItemService } from "../services/itemService.js";
import type { IdParams } from '../schemas/common.schema.js';
import type{ CreateItemDto, UpdateItemDto } from '../schemas/item.schemas.js';

export class ItemController {
  private static itemService = new ItemService();

  static async create(req: Request<{}, any, CreateItemDto>, res: Response) {
    try {
      const newItem = await ItemController.itemService.create(req.body);
      res.status(201).json(newItem);
    } catch (error: any) {
      if (error.message.includes('Categoria não encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('já existe')) {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request<IdParams, any, UpdateItemDto>, res: Response) {
    try {
      const itemId = BigInt(req.params.id);
      const updatedItem = await ItemController.itemService.update(itemId, req.body);
      res.status(200).json(updatedItem);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('já existe')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request<IdParams>, res: Response) {
    try {
      const itemId = BigInt(req.params.id);
      const result = await ItemController.itemService.delete(itemId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('está em')) {
        return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const items = await ItemController.itemService.findAll();
      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async findById(req: Request<IdParams>, res: Response) {
    try {
      const itemId = BigInt(req.params.id);
      const item = await ItemController.itemService.findById(itemId);
      res.status(200).json(item);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async findAllByCategoryId(req: Request<IdParams>, res: Response) {
    try {
      // O ':id' aqui é o categoryId
      const categoryId = BigInt(req.params.id);
      const items = await ItemController.itemService.findAllByCategoryId(categoryId);
      res.status(200).json(items);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
}