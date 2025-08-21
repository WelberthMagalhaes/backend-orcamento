# Considerações Técnicas do Projeto

## Arquitetura
- **Backend**: NestJS (Node.js + TypeScript)
- **Frontend**: Next.js (React + TypeScript)
- **Banco de Dados**: PostgreSQL
- **Infraestrutura**: Docker para desenvolvimento e deploy.

## Organização do Código
- **Backend** organizado em módulos: `clientes`, `orcamentos`, `versoes-orcamento`.
- **Frontend** organizado em páginas e componentes React.
- Integração via **REST API** (JSON).

## Padrões
- DTOs no backend para garantir tipagem e consistência.
- Regras de negócio centralizadas nos **services** do NestJS.
- Persistência via **Prisma**.
- Controle de versões de orçamento pensado como **entidade própria**.

## Decisões Futuras
- Avaliar integração com envio de orçamentos por e-mail.
- Avaliar geração de PDF para cada versão do orçamento.
- Definir modelo de autenticação mais robusto (OAuth2, integração futura com outros serviços).
- Pensar em escalabilidade (ex: usar fila para envios massivos de orçamentos).

---

📌 Este documento registra decisões de arquitetura e técnicas que norteiam o desenvolvimento.
