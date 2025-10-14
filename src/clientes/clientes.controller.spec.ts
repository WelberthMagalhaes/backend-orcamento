import { Test, TestingModule } from '@nestjs/testing';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';

describe('ClientesController', () => {
  let controller: ClientesController;

  const mockClientesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: ClientesService,
          useValue: mockClientesService,
        },
      ],
    }).compile();

    controller = module.get<ClientesController>(ClientesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a cliente', async () => {
      const createClienteDto = {
        nome: 'João Silva',
        telefone: '11999999999',
        email: 'joao@email.com',
      };
      const expectedResult = { id: 1, ...createClienteDto };

      mockClientesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createClienteDto);

      expect(result).toEqual(expectedResult);
      expect(mockClientesService.create).toHaveBeenCalledWith(createClienteDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of clientes', async () => {
      const expectedResult = [
        {
          id: 1,
          nome: 'João Silva',
          telefone: '11999999999',
          email: 'joao@email.com',
        },
      ];

      mockClientesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockClientesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cliente', async () => {
      const expectedResult = {
        id: 1,
        nome: 'João Silva',
        telefone: '11999999999',
        email: 'joao@email.com',
        orcamentos: [],
      };

      mockClientesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
      expect(mockClientesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a cliente', async () => {
      const updateClienteDto = { nome: 'João Santos' };
      const expectedResult = {
        id: 1,
        nome: 'João Santos',
        telefone: '11999999999',
        email: 'joao@email.com',
      };

      mockClientesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateClienteDto);

      expect(result).toEqual(expectedResult);
      expect(mockClientesService.update).toHaveBeenCalledWith(
        1,
        updateClienteDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a cliente', async () => {
      const expectedResult = {
        id: 1,
        nome: 'João Silva',
        telefone: '11999999999',
        email: 'joao@email.com',
      };

      mockClientesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(result).toEqual(expectedResult);
      expect(mockClientesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
