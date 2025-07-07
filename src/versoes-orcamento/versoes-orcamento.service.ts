import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVersaoOrcamentoDto } from './dto/create-versao-orcamento.dto';

@Injectable()
export class VersoesOrcamentoService {
  constructor(private prisma: PrismaService) {}

  async criarNovaVersao(orcamentoId: number, dto: CreateVersaoOrcamentoDto) {
    const orcamento = await this.prisma.orcamento.findUnique({
      where: { id: orcamentoId },
      include: {
        versoes: {
          orderBy: { numero: 'desc' },
          take: 1,
          include: { itens: true },
        },
      },
    });

    if (!orcamento) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    const ultimaVersao = orcamento.versoes[0];
    const novaVersao = await this.prisma.versaoOrcamento.create({
      data: {
        orcamentoId,
        numero: ultimaVersao.numero + 1,
      },
    });

    if (dto.copiarItens && ultimaVersao.itens.length > 0) {
      await this.prisma.itemVersao.createMany({
        data: ultimaVersao.itens.map((item) => ({
          versaoOrcamentoId: novaVersao.id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorUnitario: item.valorUnitario,
        })),
      });
    }

    return novaVersao;
  }
}
