import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { PrismaService } from './prisma/prisma.service';
import { OrcamentosModule } from './orcamentos/orcamentos.module';
import { VersoesOrcamentoModule } from './versoes-orcamento/versoes-orcamento.module';

@Module({
  imports: [ClientesModule, OrcamentosModule, VersoesOrcamentoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
