import { Test, TestingModule } from '@nestjs/testing';
import { OrcamentosController } from './orcamentos.controller';
import { OrcamentosService } from './orcamentos.service';

describe('OrcamentosController', () => {
  let controller: OrcamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrcamentosController],
      providers: [OrcamentosService],
    }).compile();

    controller = module.get<OrcamentosController>(OrcamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
