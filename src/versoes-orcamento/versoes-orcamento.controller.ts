import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { VersoesOrcamentoService } from './versoes-orcamento.service';
import { CreateVersaoOrcamentoDto } from './dto/create-versao-orcamento.dto';
import { AddItemFromCatalogDto } from './dto/add-item-from-catalog.dto';
import { CreateCustomItemDto } from './dto/create-custom-item.dto';
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

  @Get(':versaoId/itens')
  listarItens(
    @Param('versaoId', ParseIntPipe) versaoId: number,
  ): Promise<VersaoWithItensDto> {
    return this.service.listarItensVersao(versaoId);
  }
}
