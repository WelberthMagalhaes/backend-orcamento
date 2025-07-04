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

✅ Ambiente DevContainer configurado.
Me avise quando quiser que eu implemente os controllers e services para seguir a aplicação!

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

✅ Ambiente DevContainer configurado.
Me avise quando quiser que eu implemente os controllers e services para seguir a aplicação!
