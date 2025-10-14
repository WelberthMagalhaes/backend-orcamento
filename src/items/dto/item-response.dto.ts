export class ItemResponseDto {
  id: number;
  descricao: string;
  unidade?: string | null;
  valorPadrao?: number | null;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class ItemVersaoResponseDto {
  id: number;
  versaoOrcamentoId: number;
  itemId?: number;
  descricao: string;
  quantidade: number;
  unidade?: string;
  valorUnitario: number;
  valorTotal: number;
}
