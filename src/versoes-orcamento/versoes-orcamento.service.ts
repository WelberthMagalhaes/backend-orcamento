import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVersaoOrcamentoDto } from './dto/create-versao-orcamento.dto';
import { AddItemFromCatalogDto } from './dto/add-item-from-catalog.dto';
import { CreateCustomItemDto } from './dto/create-custom-item.dto';
import { UpdateItemVersaoDto } from './dto/update-item-versao.dto';
import {
  VersaoOrcamentoResponseDto,
  VersaoWithItensDto,
} from './dto/versao-response.dto';
import { ItemVersaoResponseDto } from '../items/dto/item-response.dto';

@Injectable()
export class VersoesOrcamentoService {
  constructor(private readonly prisma: PrismaService) {}

  private async verificarVersaoEditavel(versaoId: number): Promise<void> {
    const versao = await this.prisma.versaoOrcamento.findUnique({
      where: { id: versaoId },
      select: { status: true },
    });

    if (!versao) {
      throw new NotFoundException('Versão não encontrada');
    }

    if (versao.status !== 'rascunho') {
      throw new BadRequestException(
        'Versão congelada - apenas versões em rascunho podem ser editadas',
      );
    }
  }

  async criarNovaVersao(
    orcamentoId: number,
    dto: CreateVersaoOrcamentoDto,
  ): Promise<VersaoOrcamentoResponseDto> {
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
        numero: ultimaVersao ? ultimaVersao.numero + 1 : 1,
        status: 'rascunho',
      },
    });

    // Definir como versão ativa
    await this.prisma.orcamento.update({
      where: { id: orcamentoId },
      data: { versaoAtivaId: novaVersao.id },
    });

    if (dto.copiarItens && ultimaVersao?.itens.length > 0) {
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

  async adicionarItemDoCatalogo(
    versaoId: number,
    dto: AddItemFromCatalogDto,
  ): Promise<ItemVersaoResponseDto> {
    await this.verificarVersaoEditavel(versaoId);

    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado no catálogo');
    }

    const itemVersao = await this.prisma.itemVersao.create({
      data: {
        versaoOrcamentoId: versaoId,
        itemId: dto.itemId,
        descricao: item.descricao,
        quantidade: dto.quantidade,
        unidade: item.unidade,
        valorUnitario: dto.valorUnitario ?? item.valorPadrao ?? 0,
      },
    });

    return {
      ...itemVersao,
      valorTotal: itemVersao.quantidade * itemVersao.valorUnitario,
    };
  }

  async adicionarItemCustomizado(
    versaoId: number,
    dto: CreateCustomItemDto,
  ): Promise<ItemVersaoResponseDto> {
    await this.verificarVersaoEditavel(versaoId);

    let itemId: number | null = null;

    if (dto.salvarNoCatalogo) {
      const novoItem = await this.prisma.item.create({
        data: {
          descricao: dto.descricao,
          unidade: dto.unidade,
          valorPadrao: dto.valorUnitario,
        },
      });
      itemId = novoItem.id;
    }

    const itemVersao = await this.prisma.itemVersao.create({
      data: {
        versaoOrcamentoId: versaoId,
        itemId,
        descricao: dto.descricao,
        quantidade: dto.quantidade,
        unidade: dto.unidade,
        valorUnitario: dto.valorUnitario,
      },
    });

    return {
      ...itemVersao,
      valorTotal: itemVersao.quantidade * itemVersao.valorUnitario,
    };
  }

  async listarItensVersao(versaoId: number): Promise<VersaoWithItensDto> {
    const versao = await this.prisma.versaoOrcamento.findUnique({
      where: { id: versaoId },
      include: {
        itens: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!versao) {
      throw new NotFoundException('Versão não encontrada');
    }

    const itens = versao.itens.map((item) => ({
      id: item.id,
      descricao: item.descricao,
      quantidade: item.quantidade,
      unidade: item.unidade,
      valorUnitario: item.valorUnitario,
      valorTotal: item.quantidade * item.valorUnitario,
    }));

    const valorTotalVersao = itens.reduce(
      (total, item) => total + item.valorTotal,
      0,
    );

    return {
      id: versao.id,
      orcamentoId: versao.orcamentoId,
      numero: versao.numero,
      status: versao.status,
      criadaEm: versao.criadaEm,
      itens,
      valorTotalVersao,
    };
  }

  async listarVersoesPorOrcamento(
    orcamentoId: number,
  ): Promise<VersaoOrcamentoResponseDto[]> {
    return this.prisma.versaoOrcamento.findMany({
      where: { orcamentoId },
      orderBy: { numero: 'asc' },
    });
  }

  async buscarVersao(versaoId: number): Promise<VersaoWithItensDto> {
    return this.listarItensVersao(versaoId);
  }

  async atualizarItemVersao(
    versaoId: number,
    itemId: number,
    dto: UpdateItemVersaoDto,
  ): Promise<ItemVersaoResponseDto> {
    await this.verificarVersaoEditavel(versaoId);

    const itemVersao = await this.prisma.itemVersao.update({
      where: {
        id: itemId,
        versaoOrcamentoId: versaoId,
      },
      data: dto,
    });

    return {
      ...itemVersao,
      valorTotal: itemVersao.quantidade * itemVersao.valorUnitario,
    };
  }

  async removerItemVersao(versaoId: number, itemId: number): Promise<void> {
    await this.verificarVersaoEditavel(versaoId);

    await this.prisma.itemVersao.delete({
      where: {
        id: itemId,
        versaoOrcamentoId: versaoId,
      },
    });
  }

  async enviarVersao(versaoId: number): Promise<VersaoOrcamentoResponseDto> {
    const versao = await this.prisma.versaoOrcamento.findUnique({
      where: { id: versaoId },
    });

    if (!versao) {
      throw new NotFoundException('Versão não encontrada');
    }

    if (versao.status !== 'rascunho') {
      throw new Error('Apenas versões em rascunho podem ser enviadas');
    }

    return this.prisma.versaoOrcamento.update({
      where: { id: versaoId },
      data: { status: 'enviada' },
    });
  }

  async aprovarVersao(orcamentoId: number, versaoId: number): Promise<void> {
    // Regra de negócio: não permitir duas versões aprovadas
    const versaoAprovada = await this.prisma.versaoOrcamento.findFirst({
      where: {
        orcamentoId,
        status: 'aprovada',
        id: { not: versaoId },
      },
    });

    if (versaoAprovada) {
      throw new BadRequestException(
        'Já existe uma versão aprovada para este orçamento',
      );
    }

    await this.prisma.versaoOrcamento.update({
      where: { id: versaoId },
      data: { status: 'aprovada' },
    });
  }

  async rejeitarVersao(versaoId: number): Promise<VersaoOrcamentoResponseDto> {
    return this.prisma.versaoOrcamento.update({
      where: { id: versaoId },
      data: { status: 'rejeitada' },
    });
  }
}
