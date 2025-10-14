# Diagrama de Arquitetura - Sistema de Orçamento

## 🏗️ Arquitetura Geral

```mermaid
graph TB
    subgraph "Frontend (Futuro)"
        UI[Interface do Usuário<br/>Next.js + TailwindCSS]
    end
    
    subgraph "Backend - NestJS"
        API[API REST<br/>Controllers]
        
        subgraph "Módulos"
            CM[Clientes Module]
            OM[Orçamentos Module]
            VM[Versões Module]
            IM[Items Module]
        end
        
        subgraph "Serviços"
            CS[Clientes Service]
            OS[Orçamentos Service]
            VS[Versões Service]
            IS[Items Service]
        end
        
        PRISMA[Prisma ORM]
    end
    
    subgraph "Banco de Dados"
        DB[(MySQL 8.0<br/>Container)]
    end
    
    subgraph "Infraestrutura"
        DOCKER[Docker Compose<br/>Orquestração]
    end
    
    UI --> API
    API --> CM
    API --> OM
    API --> VM
    API --> IM
    
    CM --> CS
    OM --> OS
    VM --> VS
    IM --> IS
    
    CS --> PRISMA
    OS --> PRISMA
    VS --> PRISMA
    IS --> PRISMA
    
    PRISMA --> DB
    
    DOCKER -.-> DB
    DOCKER -.-> API
```

## 📊 Modelo de Dados

```mermaid
erDiagram
    Cliente {
        int id PK
        string nome
        string telefone
        string email
    }
    
    Orcamento {
        int id PK
        int clienteId FK
        datetime dataEvento
        string localEvento
        int numeroPessoas
        string status
    }
    
    VersaoOrcamento {
        int id PK
        int orcamentoId FK
        int numero
        datetime criadaEm
    }
    
    Item {
        int id PK
        string descricao
        string unidade
        float valorPadrao
        datetime criadoEm
        datetime atualizadoEm
    }
    
    ItemVersao {
        int id PK
        int versaoOrcamentoId FK
        int itemId FK
        string descricao
        int quantidade
        string unidade
        float valorUnitario
    }
    
    Cliente ||--o{ Orcamento : "possui"
    Orcamento ||--o{ VersaoOrcamento : "tem versões"
    VersaoOrcamento ||--o{ ItemVersao : "contém itens"
    Item ||--o{ ItemVersao : "referencia"
```

## 🔄 Fluxo de Negócio

```mermaid
flowchart TD
    START([Início]) --> CADASTRO_CLIENTE[Cadastrar Cliente]
    CADASTRO_CLIENTE --> CRIAR_ORCAMENTO[Criar Orçamento]
    
    CRIAR_ORCAMENTO --> VERSAO_1[Versão 1 Criada<br/>Automaticamente]
    VERSAO_1 --> ADD_ITEMS[Adicionar Itens<br/>do Catálogo ou Customizados]
    
    ADD_ITEMS --> RASCUNHO{Status: Rascunho}
    RASCUNHO --> EDITAR[Editar Itens<br/>Mesma Versão]
    EDITAR --> RASCUNHO
    
    RASCUNHO --> ENVIAR[Enviar para Cliente]
    ENVIAR --> ENVIADO[Status: Enviado<br/>Versão Congelada]
    
    ENVIADO --> APROVADO[Cliente Aprova]
    ENVIADO --> ALTERACAO[Cliente Solicita<br/>Alterações]
    
    ALTERACAO --> NOVA_VERSAO[Criar Nova Versão<br/>Incrementa Número]
    NOVA_VERSAO --> ADD_ITEMS
    
    APROVADO --> FIM([Fim])
    
    style VERSAO_1 fill:#e1f5fe
    style ENVIADO fill:#fff3e0
    style APROVADO fill:#e8f5e8
    style NOVA_VERSAO fill:#fce4ec
```

## 🛠️ Endpoints da API

```mermaid
graph LR
    subgraph "Clientes API"
        C1[POST /clientes]
        C2[GET /clientes]
        C3[GET /clientes/:id]
        C4[PATCH /clientes/:id]
        C5[DELETE /clientes/:id]
    end
    
    subgraph "Orçamentos API"
        O1[POST /orcamentos]
        O2[GET /orcamentos]
        O3[GET /orcamentos/:id]
        O4[PATCH /orcamentos/:id]
        O5[DELETE /orcamentos/:id]
    end
    
    subgraph "Versões API"
        V1[POST /versoes-orcamento]
        V2[GET /versoes-orcamento/:orcamentoId]
        V3[GET /versoes-orcamento/:id]
        V4[DELETE /versoes-orcamento/:id]
    end
    
    subgraph "Items API"
        I1[POST /items]
        I2[GET /items]
        I3[GET /items/:id]
        I4[PATCH /items/:id]
        I5[DELETE /items/:id]
    end
```

## 🐳 Containerização

```mermaid
graph TB
    subgraph "Docker Compose"
        subgraph "Backend Container"
            NEST[NestJS App<br/>Porta 3000]
        end
        
        subgraph "Database Container"
            MYSQL[MySQL 8.0<br/>Porta 3307]
        end
        
        VOLUME[(Volume MySQL<br/>Persistência)]
    end
    
    NEST --> MYSQL
    MYSQL --> VOLUME
    
    HOST[Host Machine] --> NEST
    HOST --> MYSQL
```

## 📋 Características Principais

### ✅ Implementado
- **CRUD Completo**: Clientes, Orçamentos, Versões e Items
- **Versionamento**: Controle de versões de orçamentos
- **Catálogo de Items**: Reutilização de itens padrão
- **Items Customizados**: Criação de itens específicos por versão
- **Containerização**: Docker + Docker Compose
- **ORM**: Prisma com MySQL

### 🔄 Fluxo de Versionamento
1. **Orçamento criado** → Versão 1 automática
2. **Edições em rascunho** → Mesma versão
3. **Envio para cliente** → Versão congelada
4. **Solicitação de alteração** → Nova versão criada
5. **Histórico preservado** → Todas as versões mantidas

### 🎯 Próximos Passos
- Frontend em Next.js
- Autenticação e autorização
- Geração de PDFs
- Notificações por email
- Dashboard de relatórios