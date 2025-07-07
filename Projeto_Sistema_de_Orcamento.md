### Projeto: Sistema de Orçamento com Versões

#### Linguagens & Ferramentas
- NestJS (Node.js 22)
- Prisma ORM
- PostgreSQL 16
- Docker & Docker Compose
- DevContainer (VS Code Remote Containers)

---

### 1. Estrutura do Banco (Prisma Schema)
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Cliente {
  id       Int        @id @default(autoincrement())
  nome     String
  telefone String?
  email    String?
  orcamentos Orcamento[]
}

model Orcamento {
  id             Int               @id @default(autoincrement())
  clienteId      Int
  cliente        Cliente           @relation(fields: [clienteId], references: [id])
  dataEvento     DateTime
  localEvento    String
  numeroPessoas  Int
  status         String           @default("rascunho")
  versoes        VersaoOrcamento[]
}

model VersaoOrcamento {
  id           Int           @id @default(autoincrement())
  orcamentoId  Int
  numero       Int           // Versão 1, 2, etc
  criadaEm     DateTime      @default(now())
  orcamento    Orcamento     @relation(fields: [orcamentoId], references: [id])
  itens        ItemVersao[]
}

model ItemVersao {
  id                Int               @id @default(autoincrement())
  versaoOrcamentoId Int
  descricao         String
  quantidade        Int
  unidade           String?
  valorUnitario     Float
  versao            VersaoOrcamento  @relation(fields: [versaoOrcamentoId], references: [id])
}
```

---

### 2. Docker Compose (PostgreSQL 16 + NestJS backend com Node 22)
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:16
    container_name: postgres_orcamento
    restart: always
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: orcamento
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: .
    container_name: nest_orcamento
    depends_on:
      - db
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://dev:dev@db:5432/orcamento
    volumes:
      - .:/app

volumes:
  pgdata:
```
- DevContainer (VS Code Remote Containers)

---

### 1. Estrutura do Banco (Prisma Schema)
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Cliente {
  id       Int        @id @default(autoincrement())
  nome     String
  telefone String?
  email    String?
  orcamentos Orcamento[]
}

model Orcamento {
  id             Int               @id @default(autoincrement())
  clienteId      Int
  cliente        Cliente           @relation(fields: [clienteId], references: [id])
  dataEvento     DateTime
  localEvento    String
  numeroPessoas  Int
  status         String           @default("rascunho")
  versoes        VersaoOrcamento[]
}

model VersaoOrcamento {
  id           Int           @id @default(autoincrement())
  orcamentoId  Int
  numero       Int           // Versão 1, 2, etc
  criadaEm     DateTime      @default(now())
  orcamento    Orcamento     @relation(fields: [orcamentoId], references: [id])
  itens        ItemVersao[]
}

model ItemVersao {
  id                Int               @id @default(autoincrement())
  versaoOrcamentoId Int
  descricao         String
  quantidade        Int
  unidade           String?
  valorUnitario     Float
  versao            VersaoOrcamento  @relation(fields: [versaoOrcamentoId], references: [id])
}
```

---

### 2. Docker Compose (PostgreSQL 16 + NestJS backend com Node 22)
```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    container_name: postgres_orcamento
    restart: always
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: orcamento
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: .
    container_name: nest_orcamento
    depends_on:
      - db
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://dev:dev@db:5432/orcamento
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run start:dev
    working_dir: /app

volumes:
  pgdata:
```

---
### 3. DevContainer (para VS Code)
Crie uma pasta chamada `.devcontainer/` na raiz do projeto com os arquivos abaixo:

#### `.devcontainer/devcontainer.json`
```json
{
  "name": "Orcamento NestJS",
  "dockerComposeFile": ["../docker-compose.yml"],
  "service": "backend",
  "workspaceFolder": "/app",
  "settings": {
    "terminal.integrated.defaultProfile.linux": "bash"
  },
  "extensions": [
    "esbenp.prettier-vscode",
    "Prisma.prisma",
    "dbaeumer.vscode-eslint"
  ],
  "postCreateCommand": "npm install"
}
```

---

### 4. Instruções para rodar (com ou sem DevContainer)
```bash
# 1. Clonar projeto
$ git clone <projeto-url>
$ cd <projeto>

# 2. Instalar dependências (localmente ou dentro do container)
$ npm install

# 3. Subir containers
$ docker-compose up -d --build

# 4. Rodar migração inicial do Prisma (após entrar no container)
$ npx prisma migrate dev --name init

# 5. Iniciar backend manualmente (caso queira fora do container)
$ npm run start:dev
```

---

### 5. Proximos passos
- Criar os services, controllers e DTOs no NestJS
- Criar endpoints:
  - POST /clientes
  - POST /orcamentos (cria com versao 1)
  - POST /orcamentos/:id/versoes (nova versao)
  - GET /orcamentos/:id (listar com versoes)

---


### 7. Módulo Orcamentos (NestJS)

#### Gerar recurso
```bash
npx nest g resource orcamentos
```

#### DTOs
```ts
// create-orcamento.dto.ts
export class CreateOrcamentoDto {
  clienteId: number;
  dataEvento: string; // ISO string
  localEvento: string;
  numeroPessoas: number;
}

// update-orcamento.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrcamentoDto } from './create-orcamento.dto';

export class UpdateOrcamentoDto extends PartialType(CreateOrcamentoDto) {}
```

#### Service (`orcamentos.service.ts`)
```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateOrcamentoDto } from './dto/create-orcamento.dto';
import { UpdateOrcamentoDto } from './dto/update-orcamento.dto';

@Injectable()
export class OrcamentosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrcamentoDto) {
    const orcamento = await this.prisma.orcamento.create({
      data: {
        clienteId: data.clienteId,
        dataEvento: new Date(data.dataEvento),
        localEvento: data.localEvento,
        numeroPessoas: data.numeroPessoas,
      },
    });

    await this.prisma.versaoOrcamento.create({
      data: {
        orcamentoId: orcamento.id,
        numero: 1,
      },
    });

    return orcamento;
  }

  findAll() {
    return this.prisma.orcamento.findMany({ include: { versoes: true } });
  }

  async findOne(id: number) {
    const orcamento = await this.prisma.orcamento.findUnique({
      where: { id },
      include: { versoes: { include: { itens: true } } },
    });
    if (!orcamento) {
      throw new NotFoundException(`Orçamento com ID ${id} não encontrado.`);
    }
    return orcamento;
  }

  async update(id: number, data: UpdateOrcamentoDto) {
    try {
      return await this.prisma.orcamento.update({
        where: { id },
        data: {
          ...data,
          dataEvento: data.dataEvento ? new Date(data.dataEvento) : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Orçamento com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.orcamento.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Orçamento com ID ${id} não encontrado.`);
      }
      throw error;
    }
  }
}
```

#### Testes com cURL
```bash
# Criar orçamento
curl -X POST http://localhost:3000/orcamentos \
  -H 'Content-Type: application/json' \
  -d '{
    "clienteId": 1,
    "dataEvento": "2025-08-01T18:00:00.000Z",
    "localEvento": "Salão Azul",
    "numeroPessoas": 100
  }'

# Listar orçamentos
curl http://localhost:3000/orcamentos
```

---

### 8. Módulo `versoes-orcamento` (manual)

#### ✅ Função
Permitir criar nova versão manualmente com base na última, incrementando o número e permitindo editar os itens depois.

#### Gerar módulo:
```bash
npx nest g module versoes-orcamento
npx nest g service versoes-orcamento
npx nest g controller versoes-orcamento
```

#### DTO (create-versao-orcamento.dto.ts)
```ts
export class CreateVersaoOrcamentoDto {
  copiarItens?: boolean = true; // default: copia os itens da versão anterior
}
```

#### Service (`versoes-orcamento.service.ts`)
```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVersaoOrcamentoDto } from './dto/create-versao-orcamento.dto';

@Injectable()
export class VersoesOrcamentoService {
  constructor(private prisma: PrismaService) {}

  async criarNovaVersao(orcamentoId: number, dto: CreateVersaoOrcamentoDto) {
    const orcamento = await this.prisma.orcamento.findUnique({
      where: { id: orcamentoId },
      include: {
        versoes: {
          orderBy: { numero: 'desc' },
          take: 1,
          include: { itens: true },
        },
      },
    });

    if (!orcamento) {
      throw new NotFoundException('Orçamento não encontrado');
    }

    const ultimaVersao = orcamento.versoes[0];
    const novaVersao = await this.prisma.versaoOrcamento.create({
      data: {
        orcamentoId,
        numero: ultimaVersao.numero + 1,
      },
    });

    if (dto.copiarItens && ultimaVersao.itens.length > 0) {
      await this.prisma.itemVersao.createMany({
        data: ultimaVersao.itens.map((item) => ({
          versaoOrcamentoId: novaVersao.id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorUnitario: item.valorUnitario,
        })),
      });
    }

    return novaVersao;
  }
}
```

#### Controller (`versoes-orcamento.controller.ts`)
```ts
import { Controller, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { VersoesOrcamentoService } from './versoes-orcamento.service';
import { CreateVersaoOrcamentoDto } from './dto/create-versao-orcamento.dto';

@Controller('orcamentos/:orcamentoId/versoes')
export class VersoesOrcamentoController {
  constructor(private readonly service: VersoesOrcamentoService) {}

  @Post()
  criar(
    @Param('orcamentoId', ParseIntPipe) orcamentoId: number,
    @Body() dto: CreateVersaoOrcamentoDto,
  ) {
    return this.service.criarNovaVersao(orcamentoId, dto);
  }
}
```

#### Exemplo de chamada HTTP
```http
POST /orcamentos/1/versoes
Content-Type: application/json

{
  "copiarItens": true
}
```

---

(Próximo: endpoint para adicionar ou editar itens da versão, se desejar seguir.)

