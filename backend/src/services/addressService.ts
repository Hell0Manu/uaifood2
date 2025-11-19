import { AddressRepository } from "../repositories/addressRepository.js";
import { type Prisma, type Address, UserType } from "@prisma/client";
import { UserRepository } from "../repositories/userRepository.js";
import type { IAuthenticatedUser } from '../@types/express/index.js';
import type { CreateAddressDto, UpdateAddressDto } from "../schemas/address.schema.js";

export class AddressService {
  private addressRepository = new AddressRepository();
  private userRepository = new UserRepository();

  async create(userId: bigint, data: CreateAddressDto, authenticatedUser: IAuthenticatedUser): Promise<Address> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado. Impossível criar endereço.");
    }

    if(user.userType === UserType.CLIENT && user.id !== authenticatedUser.id) {
      throw new Error("Acesso negado. Você só pode criar endereços para você mesmo.");
    }

    const dataToSave: Prisma.AddressCreateInput = {
      ...data,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.addressRepository.create(dataToSave);
  }

  async update(
    addressId: bigint,
    authenticatedUser: IAuthenticatedUser,
    data: UpdateAddressDto
  ): Promise<Address> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error("Endereço não encontrado.");
    }

    if (authenticatedUser.role === UserType.CLIENT && address.userId !== authenticatedUser.id) {
      throw new Error("Acesso negado. Este endereço não pertence a você.");
    }

    const dataToUpdate: Prisma.AddressUpdateInput = {};

    if (data.street) dataToUpdate.street = data.street;
    if (data.number) dataToUpdate.number = data.number;
    if (data.district) dataToUpdate.district = data.district;
    if (data.city) dataToUpdate.city = data.city;
    if (data.state) dataToUpdate.state = data.state;
    if (data.zipCode) dataToUpdate.zipCode = data.zipCode;

    return this.addressRepository.update(addressId, dataToUpdate);
  }

  async delete(
    addressId: bigint,
    authenticatedUser: IAuthenticatedUser
  ): Promise<{ message: string }> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error("Endereço não encontrado.");
    }

    if (authenticatedUser.role === UserType.CLIENT && address.userId !== authenticatedUser.id) {
      throw new Error("Acesso negado. Este endereço não pertence a você.");
    }

    await this.addressRepository.delete(addressId);
    return { message: "Endereço deletado com sucesso" };
  }

  async findAllByUserId(userId: bigint, authenticatedUser: IAuthenticatedUser): Promise<Address[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("Usuario não encontrado.");
    }

    if(user.userType === UserType.CLIENT && user.id !== authenticatedUser.id) {
      throw new Error("Acesso negado. Você só pode ver seus próprios endereços.");
    }

    const addressUser = await this.addressRepository.findAllByUserId(userId);

    return addressUser;
  }

  async listAllAddresses(): Promise<Address[]> {
    const addresses = await this.addressRepository.findAll();

    return addresses;
  }


}
