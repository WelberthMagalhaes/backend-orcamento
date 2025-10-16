export class HistoricoVersaoResponseDto {
  id: number;
  versaoId: number;
  statusAnterior: string | null;
  statusNovo: string;
  motivo: string | null;
  usuarioId: number | null;
  criadoEm: Date;
}
