import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { VersoesOrcamentoService } from './versoes-orcamento.service';
import { CreateVersaoOrcamentoDto } from './dto/create-versao-orcamento.dto';
import { AddItemFromCatalogDto } from './dto/add-item-from-catalog.dto';
import { CreateCustomItemDto } from './dto/create-custom-item.dto';
import { UpdateItemVersaoDto } from './dto/update-item-versao.dto';
import {
  VersaoOrcamentoResponseDto,
  VersaoWithItensDto,
} from './dto/versao-response.dto';
import { ItemVersaoResponseDto } from '../items/dto/item-response.dto';

@Controller('orcamentos/:orcamentoId/versoes')
export class VersoesOrcamentoController {
  constructor(private readonly service: VersoesOrcamentoService) {}

  @Post()
  criar(
    @Param('orcamentoId', ParseIntPipe) orcamentoId: number,
    @Body() dto: CreateVersaoOrcamentoDto,
  ): Promise<VersaoOrcamentoResponseDto> {
    return this.service.criarNovaVersao(orcamentoId, dto);
  }

  @Post(':versaoId/itens/catalogo')
  adicionarItemDoCatalogo(
    @Param('versaoId', ParseIntPipe) versaoId: number,
    @Body() dto: AddItemFromCatalogDto,
  ): Promise<ItemVersaoResponseDto> {
    return this.service.adicionarItemDoCatalogo(versaoId, dto);
  }

  @Post(':versaoId/itens/customizado')
  adicionarItemCustomizado(
    @Param('versaoId', ParseIntPipe) versaoId: number,
    @Body() dto: CreateCustomItemDto,
  ): Promise<ItemVersaoResponseDto> {
    return this.service.adicionarItemCustomizado(versaoId, dto);
  }

  @Get()
  listarVersoes(
    @Param('orcamentoId', ParseIntPipe) orcamentoId: number,
  ): Promise<VersaoOrcamentoResponseDto[]> {
    return this.service.listarVersoesPorOrcamento(orcamentoId);
  }

  @Get(':versaoId')
  buscarVersao(
    @Param('versaoId', ParseIntPipe) versaoId: number,
  ): Promise<VersaoWithItensDto> {
    return this.service.buscarVersao(versaoId);
  }

  @Get(':versaoId/itens')
  listarItens(
    @Param('versaoId', ParseIntPipe) versaoId: number,
  ): Promise<VersaoWithItensDto> {
    return this.service.listarItensVersao(versaoId);
  }

  @Patch(':versaoId/itens/:itemId')
  atualizarItem(
    @Param('versaoId', ParseIntPipe) versaoId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateItemVersaoDto,
  ): Promise<ItemVersaoResponseDto> {
    return this.service.atualizarItemVersao(versaoId, itemId, dto);
  }

  @Delete(':versaoId/itens/:itemId')
  removerItem(
    @Param('versaoId', ParseIntPipe) versaoId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<void> {
    return this.service.removerItemVersao(versaoId, itemId);
  }

  @Post(':versaoId/enviar')
  enviarVersao(
    @Param('versaoId', ParseIntPipe) versaoId: number,
  ): Promise<VersaoOrcamentoResponseDto> {
    return this.service.enviarVersao(versaoId);
  }

  @Post(':versaoId/aprovar')
  aprovarVersao(
    @Param('versaoId', ParseIntPipe) versaoId: number,
  ): Promise<VersaoOrcamentoResponseDto> {
    return this.service.aprovarVersao(versaoId);
  }

  @Post(':versaoId/rejeitar')
  rejeitarVersao(
    @Param('versaoId', ParseIntPipe) versaoId: number,
  ): Promise<VersaoOrcamentoResponseDto> {
    return this.service.rejeitarVersao(versaoId);
  }
}
