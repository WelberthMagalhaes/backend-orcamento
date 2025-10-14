import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ClientesService', () => {
  let service: ClientesService;

  const mockPrismaService = {
    cliente: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cliente', async () => {
      const createClienteDto = {
        nome: 'João Silva',
        telefone: '11999999999',
        email: 'joao@email.com',
      };
      const expectedResult = { id: 1, ...createClienteDto };

      mockPrismaService.cliente.create.mockResolvedValue(expectedResult);

      const result = await service.create(createClienteDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.cliente.create).toHaveBeenCalledWith({
        data: createClienteDto,
      });
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

      mockPrismaService.cliente.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.cliente.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cliente with orcamentos', async () => {
      const expectedResult = {
        id: 1,
        nome: 'João Silva',
        telefone: '11999999999',
        email: 'joao@email.com',
        orcamentos: [],
      };

      mockPrismaService.cliente.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.cliente.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          orcamentos: {
            select: {
              id: true,
              dataEvento: true,
              localEvento: true,
              status: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException when cliente not found', async () => {
      mockPrismaService.cliente.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
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

      mockPrismaService.cliente.update.mockResolvedValue(expectedResult);

      const result = await service.update(1, updateClienteDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.cliente.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateClienteDto,
      });
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

      mockPrismaService.cliente.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(1);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.cliente.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
