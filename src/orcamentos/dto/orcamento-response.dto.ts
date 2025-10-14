export class OrcamentoResponseDto {
  id: number;
  clienteId: number;
  dataEvento: Date;
  localEvento: string;
  numeroPessoas: number;
  status: string;
  cliente?: {
    id: number;
    nome: string;
  };
}

export class OrcamentoWithVersoesDto extends OrcamentoResponseDto {
  versoes: {
    id: number;
    numero: number;
    criadaEm: Date;
    totalItens?: number;
  }[];
}
