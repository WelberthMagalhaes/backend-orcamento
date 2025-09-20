export class AddItemFromCatalogDto {
  itemId: number;
  quantidade: number;
  valorUnitario?: number; // Se não informado, usa o valor padrão do catálogo
}
