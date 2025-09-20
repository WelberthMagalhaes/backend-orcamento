import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  create(createItemDto: CreateItemDto) {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  findAll() {
    return this.prisma.item.findMany({
      orderBy: { descricao: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.item.findUnique({
      where: { id },
    });
  }

  update(id: number, updateItemDto: UpdateItemDto) {
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
