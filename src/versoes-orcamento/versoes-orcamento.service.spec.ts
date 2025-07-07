import { Test, TestingModule } from '@nestjs/testing';
import { VersoesOrcamentoService } from './versoes-orcamento.service';

describe('VersoesOrcamentoService', () => {
  let service: VersoesOrcamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VersoesOrcamentoService],
    }).compile();

    service = module.get<VersoesOrcamentoService>(VersoesOrcamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
