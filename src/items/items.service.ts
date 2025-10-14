import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemResponseDto } from './dto/item-response.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  async findAll(): Promise<ItemResponseDto[]> {
    return this.prisma.item.findMany({
      orderBy: { descricao: 'asc' },
    });
  }

  async findOne(id: number): Promise<ItemResponseDto> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado.`);
    }
    return item;
  }

  async update(
    id: number,
    updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    return this.prisma.item.update({
      where: { id },
      data: updateItemDto,
    });
  }

  remove(id: number) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}
