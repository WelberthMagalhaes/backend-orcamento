export class VersaoOrcamentoResponseDto {
  id: number;
  orcamentoId: number;
  numero: number;
  criadaEm: Date;
}

export class VersaoWithItensDto extends VersaoOrcamentoResponseDto {
  itens: {
    id: number;
    descricao: string;
    quantidade: number;
    unidade?: string | null;
    valorUnitario: number;
    valorTotal: number;
  }[];
  valorTotalVersao: number;
}
