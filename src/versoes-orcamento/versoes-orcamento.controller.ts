import { Controller, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { VersoesOrcamentoService } from './versoes-orcamento.service';
import { CreateVersaoOrcamentoDto } from './dto/create-versao-orcamento.dto';

@Controller('orcamentos/:orcamentoId/versoes')
export class VersoesOrcamentoController {
  constructor(private readonly service: VersoesOrcamentoService) {}

  @Post()
  criar(
    @Param('orcamentoId', ParseIntPipe) orcamentoId: number,
    @Body() dto: CreateVersaoOrcamentoDto,
  ) {
    return this.service.criarNovaVersao(orcamentoId, dto);
  }
}
