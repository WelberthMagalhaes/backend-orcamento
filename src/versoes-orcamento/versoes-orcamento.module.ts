import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VersoesOrcamentoService } from './versoes-orcamento.service';
import { VersoesOrcamentoController } from './versoes-orcamento.controller';

@Module({
  imports: [PrismaModule],
  providers: [VersoesOrcamentoService],
  controllers: [VersoesOrcamentoController],
})
export class VersoesOrcamentoModule {}
