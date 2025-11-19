import { hash, compare } from "bcryptjs";
import { UserRepository } from "../repositories/userRepository.js";
import { UserType, type Prisma, type User } from "@prisma/client";
import redisClient from "../configs/redis.client.js";
import { generateToken, verifyToken } from "../configs/jwt.config.js";
import type { IAuthenticatedUser } from '../@types/express/index.js';
import type {
  RegisterUserDto,
  authenticateUserDto,
  UpdateUserDto,
} from "../schemas/user.schema.js";

export class UserService {
  private userRepository = new UserRepository();

  async register(data: RegisterUserDto): Promise<Omit<User, "password">> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Este email já está em uso.");
    }

    const hashedPassword = await hash(data.password, 10);
    const newUser = await this.userRepository.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: hashedPassword,
      birthDate: new Date(data.birthDate),
      userType: UserType.CLIENT,
    });
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  async updateProfile(
    userId: bigint,
    data: UpdateUserDto,
    authenticatedUser: IAuthenticatedUser
  ): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario não encontrado");
    }

    if (authenticatedUser.role == UserType.CLIENT) {
      if (authenticatedUser.id != userId) {
        throw new Error(
          "Acesso negado. Você só pode atualizar seu próprio perfil."
        );
      }
      if (data.userType && data.userType !== UserType.CLIENT) {
        throw new Error(
          "Acesso negado. Você não pode alterar seu próprio papel."
        );
      }
    }

    const dataToUpdate: Prisma.UserUpdateInput = {};

    if (data.name) dataToUpdate.name = data.name;
    if (data.email) dataToUpdate.email = data.email;
    if (data.phone) dataToUpdate.phone = data.phone;
    if (data.birthDate) dataToUpdate.birthDate = new Date(data.birthDate);
    if (data.userType) dataToUpdate.userType = data.userType;


    if (data.password && typeof data.password === "string") {
      data.password = await hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.update(userId, dataToUpdate);

    const { password, ...safeUser } = updatedUser;

    return safeUser;
  }

  async deleteUser(
    userId: bigint,
    authenticatedUser: IAuthenticatedUser
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario não encontrado");
    }

    if (
      authenticatedUser.role == UserType.CLIENT &&
      authenticatedUser.id != userId
    ) {
      throw new Error(
        "Acesso negado. Você só pode deletar seu próprio perfil."
      );
    }

    await this.userRepository.delete(userId);
    return { message: "Usuario deletado com sucesso" };
  }

  async viewProfileId(
    userId: bigint,
    authenticatedUser: IAuthenticatedUser
  ): Promise<Omit<User, "password">> {
    if (
      authenticatedUser.role == UserType.CLIENT &&
      authenticatedUser.id != userId
    ) {
      throw new Error("Acesso negado. Você só pode ver seu próprio perfil.");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuario não encontrado");
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async viewMyProfile(
    authenticatedUser: IAuthenticatedUser
  ): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findById(
      authenticatedUser.id
    );
    if (!user) {
      throw new Error("Usuario não encontrado");
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async listAllUsers(): Promise<Omit<User, "password">[]> {
    const users = await this.userRepository.findAll();

    if (users.length === 0) {
      throw new Error("Nenhum usuario encontrado");
    }

    return users.map(({ password, ...safeUser }) => safeUser);
  }

  async authenticate(
    data: authenticateUserDto
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || !(await compare(data.password, user.password))) {
      throw new Error("Email ou senha inválidos");
    }

    const token = generateToken(user.id, user.userType);
    const { password, ...safeUser } = user;

    return { user: safeUser, token: token };
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      const payload = verifyToken(token);

      const expiry = payload.exp as number;
      const now = Math.floor(Date.now() / 1000);
      const remainingTime = expiry - now;

      if (remainingTime > 0) {
        // 'SET' com 'EX' (expire)
        await redisClient.set(token, "revoked", {
          EX: remainingTime,
        });
      }
      return { message: "Logout realizado com sucesso" };
    } catch (error: any) {
      throw new Error("Erro ao realizar logout: " + error.message);
    }
  }
}
