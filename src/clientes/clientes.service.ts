import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import {
  ClienteResponseDto,
  ClienteWithOrcamentosDto,
} from './dto/cliente-response.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto): Promise<ClienteResponseDto> {
    return this.prisma.cliente.create({ data });
  }

  async findAll(): Promise<ClienteResponseDto[]> {
    return this.prisma.cliente.findMany();
  }

  async findOne(id: number): Promise<ClienteWithOrcamentosDto> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        orcamentos: {
          select: {
            id: true,
            dataEvento: true,
            localEvento: true,
            status: true,
          },
        },
      },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
    }
    return cliente;
  }

  async update(
    id: number,
    data: UpdateClienteDto,
  ): Promise<ClienteResponseDto> {
    try {
      return await this.prisma.cliente.update({ where: { id }, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.cliente.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }
}
