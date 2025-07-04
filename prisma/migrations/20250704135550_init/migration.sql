-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orcamento" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "dataEvento" TIMESTAMP(3) NOT NULL,
    "localEvento" TEXT NOT NULL,
    "numeroPessoas" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'rascunho',

    CONSTRAINT "Orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VersaoOrcamento" (
    "id" SERIAL NOT NULL,
    "orcamentoId" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VersaoOrcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemVersao" (
    "id" SERIAL NOT NULL,
    "versaoOrcamentoId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "unidade" TEXT,
    "valorUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemVersao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orcamento" ADD CONSTRAINT "Orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersaoOrcamento" ADD CONSTRAINT "VersaoOrcamento_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemVersao" ADD CONSTRAINT "ItemVersao_versaoOrcamentoId_fkey" FOREIGN KEY ("versaoOrcamentoId") REFERENCES "VersaoOrcamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
