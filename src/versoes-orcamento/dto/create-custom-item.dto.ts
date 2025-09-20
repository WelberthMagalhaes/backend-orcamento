export class CreateCustomItemDto {
  descricao: string;
  quantidade: number;
  unidade?: string;
  valorUnitario: number;
  salvarNoCatalogo?: boolean; // Se true, salva também no catálogo
}
