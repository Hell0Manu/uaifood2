import type { Request, Response } from 'express';
import { AddressService } from "../services/addressService.js";
import type { IdParams } from '../schemas/common.schema.js';
import type { CreateAddressDto, UpdateAddressDto } from '../schemas/address.schema.js';

export class AddressController {
    private static addressService = new AddressService();
    
    static async create(req: Request<IdParams, any, CreateAddressDto>, res: Response) {
    try {
      const authenticatedUser = req.user;
      const data = req.body;
      const userId = BigInt(req.params.id);

      const newAddress = await AddressController.addressService.create(
        userId,
        data,
        authenticatedUser
      );

      res.status(201).json(newAddress);
    } catch (error: any) {
      if (error.message.startsWith('Acesso negado')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request<IdParams, any, UpdateAddressDto>, res: Response) {
    try {
      const authenticatedUser = req.user;
      const data = req.body;
      const addressId = BigInt(req.params.id);

      const updatedAddress = await AddressController.addressService.update(
        addressId,
        authenticatedUser,
        data
      );

      res.status(200).json(updatedAddress);
    } catch (error: any) {
      if (error.message.startsWith('Acesso negado')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request<IdParams>, res: Response) {
    try {
      const authenticatedUser = req.user;
      const addressId = BigInt(req.params.id);

      const result = await AddressController.addressService.delete(
        addressId,
        authenticatedUser
      );

      res.status(200).json(result);
    } catch (error: any) {
      if (error.message.startsWith('Acesso negado')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async findAllByUserId(req: Request<IdParams>, res: Response) {
    try {
      const authenticatedUser = req.user;
      const userId = BigInt(req.params.id);

      const addresses = await AddressController.addressService.findAllByUserId(
        userId,
        authenticatedUser
      );

      res.status(200).json(addresses);
    } catch (error: any) {
      if (error.message.startsWith('Acesso negado')) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async listAll(req: Request, res: Response) {
    try {
      const addresses = await AddressController.addressService.listAllAddresses();
      res.status(200).json(addresses);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

}