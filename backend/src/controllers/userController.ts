import type { Request, Response } from "express";
import { UserService } from "../services/userService.js";
import type { IdParams } from '../schemas/common.schema.js';
import type { RegisterUserDto, UpdateUserDto } from '../schemas/user.schema.js';

export class UserController {
  private static userService = new UserService();

  static async register(req: Request, res: Response) {
    try {
      const userData: RegisterUserDto = req.body;

      const newUser = await UserController.userService.register(userData);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const authPayload = await UserController.userService.authenticate(req.body);
      res.status(200).json(authPayload);
    } catch (error: any) {
      res.status(401).json({ error: (error as Error).message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        throw new Error("Token não fornecido.");
      }

      const result = await UserController.userService.logout(token);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteUser(req: Request<IdParams>, res: Response) {
    try {
      const authenticatedUser = req.user;

      const userIdToDelete = BigInt(req.params.id);

      const result = await UserController.userService.deleteUser(
        userIdToDelete,
        authenticatedUser
      );
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "Usuario não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.startsWith("Acesso negado")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async updateProfile(req: Request<IdParams, any, UpdateUserDto>, res: Response) {
    try {
      const dataToUpdate = req.body;
      const authenticatedUser = req.user;

      let userIdToUpdate = BigInt(req.params.id);

      if (Object.keys(dataToUpdate).length === 0) {
        throw new Error("Nenhum dado fornecido para atualização.");
      }

      const updatedUser = await UserController.userService.updateProfile(
        userIdToUpdate,
        dataToUpdate,
        authenticatedUser
      );
      res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error.message === "Usuario não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.startsWith("Acesso negado")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async viewProfileId(req: Request<IdParams>, res: Response) {
    try {
      const authenticatedUser = req.user;

      let userId = BigInt(req.params.id);

      const user = await UserController.userService.viewProfileId(
        userId,
        authenticatedUser
      );
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === "Usuario não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async viewMyProfile(req: Request, res: Response) {
    try {
      const authenticatedUser = req.user;

      let userId = BigInt(authenticatedUser.id);

      const user = await UserController.userService.viewMyProfile(
        authenticatedUser
      );
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === "Usuario não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async listAllUsers(req: Request, res: Response) {
    try {
      const users = await UserController.userService.listAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
