# Projeto: Sistema de Orçamento

## Visão Geral
O objetivo do sistema é permitir o cadastro de **clientes**, a criação de **orçamentos** e o controle de **versões de orçamento**, possibilitando que alterações sejam registradas sem sobrescrever versões anteriores.

O projeto segue uma arquitetura moderna com **backend em NestJS** e **frontend em Next.js (React)**, ambos rodando em containers Docker.  

---

## Tecnologias Utilizadas
- **Backend**
  - [NestJS](https://nestjs.com/) — framework Node.js modular
  - [Prisma ORM](https://www.prisma.io/) — acesso ao banco
  - [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
  - [Docker](https://www.docker.com/) — orquestração do ambiente
  
- **Frontend**
  - [Next.js](https://nextjs.org/) — framework React full-stack
  - [TailwindCSS](https://tailwindcss.com/) — estilização
  - Consumo da API via fetch/axios
  
---

## Estrutura Atual do Backend

### Módulo `Clientes`
- CRUD completo para gerenciamento de clientes.
- Endpoints:
  - `POST /clientes` → Criar cliente
  - `GET /clientes` → Listar clientes
  - `GET /clientes/:id` → Buscar cliente
  - `PATCH /clientes/:id` → Atualizar cliente
  - `DELETE /clientes/:id` → Remover cliente

### Módulo `Orçamentos`
- CRUD para criação e gerenciamento de orçamentos.
- Cada orçamento pertence a um cliente.
- Endpoints:
  - `POST /orcamentos` → Criar orçamento (inicia com versão 1)
  - `GET /orcamentos` → Listar orçamentos
  - `GET /orcamentos/:id` → Detalhes de um orçamento
  - `PATCH /orcamentos/:id` → Atualizar dados principais (não cria nova versão)
  - `DELETE /orcamentos/:id` → Remover orçamento

### Módulo `Versões de Orçamento`
- Mantém histórico de alterações de um orçamento.
- Sempre que uma nova versão é criada, o sistema incrementa o número da versão.
- Endpoints:
  - `POST /versoes-orcamento` → Criar nova versão de um orçamento
  - `GET /versoes-orcamento/:orcamentoId` → Listar versões de um orçamento
  - `GET /versoes-orcamento/:id` → Buscar versão específica
  - `DELETE /versoes-orcamento/:id` → Remover versão (quando necessário)

---

## Estrutura do Banco de Dados (Prisma)

```prisma
model Cliente {
  id         Int          @id @default(autoincrement())
  nome       String
  email      String?
  telefone   String?
  orcamentos Orcamento[]
}

model Orcamento {
  id              Int               @id @default(autoincrement())
  titulo          String
  descricao       String?
  clienteId       Int
  cliente         Cliente           @relation(fields: [clienteId], references: [id])
  versoes         VersaoOrcamento[]
  criadoEm        DateTime          @default(now())
}

model VersaoOrcamento {
  id          Int       @id @default(autoincrement())
  numero      Int
  orcamentoId Int
  orcamento   Orcamento @relation(fields: [orcamentoId], references: [id])
  criadoEm    DateTime  @default(now())
}
