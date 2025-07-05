import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrcamentoDto } from './dto/create-orcamento.dto';
import { UpdateOrcamentoDto } from './dto/update-orcamento.dto';

@Injectable()
export class OrcamentosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrcamentoDto) {
    const orcamento = await this.prisma.orcamento.create({
      data: {
        clienteId: data.clienteId,
        dataEvento: new Date(data.dataEvento),
        localEvento: data.localEvento,
        numeroPessoas: data.numeroPessoas,
      },
    });

    await this.prisma.versaoOrcamento.create({
      data: {
        orcamentoId: orcamento.id,
        numero: 1,
      },
    });

    return orcamento;
  }

  findAll() {
    return this.prisma.orcamento.findMany({ include: { versoes: true } });
  }

  async findOne(id: number) {
    const orcamento = await this.prisma.orcamento.findUnique({
      where: { id },
      include: { versoes: { include: { itens: true } } },
    });
    if (!orcamento) {
      throw new NotFoundException(`Orçamento com ID ${id} não encontrado.`);
    }
    return orcamento;
  }

  async update(id: number, data: UpdateOrcamentoDto) {
    try {
      return await this.prisma.orcamento.update({
        where: { id },
        data: {
          ...data,
          dataEvento: data.dataEvento ? new Date(data.dataEvento) : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Orçamento com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.orcamento.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Orçamento com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }
}
