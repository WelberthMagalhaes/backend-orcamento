export class ClienteResponseDto {
  id: number;
  nome: string;
  telefone?: string | null;
  email?: string | null;
}

export class ClienteWithOrcamentosDto extends ClienteResponseDto {
  orcamentos: {
    id: number;
    dataEvento: Date;
    localEvento: string;
    status: string;
  }[];
}
