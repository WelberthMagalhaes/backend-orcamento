import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import {
  ClienteResponseDto,
  ClienteWithOrcamentosDto,
} from './dto/cliente-response.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(
    @Body() createClienteDto: CreateClienteDto,
  ): Promise<ClienteResponseDto> {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll(): Promise<ClienteResponseDto[]> {
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ClienteWithOrcamentosDto> {
    return this.clientesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<ClienteResponseDto> {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
