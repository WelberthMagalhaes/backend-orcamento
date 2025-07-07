import { Test, TestingModule } from '@nestjs/testing';
import { VersoesOrcamentoController } from './versoes-orcamento.controller';

describe('VersoesOrcamentoController', () => {
  let controller: VersoesOrcamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersoesOrcamentoController],
    }).compile();

    controller = module.get<VersoesOrcamentoController>(VersoesOrcamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
