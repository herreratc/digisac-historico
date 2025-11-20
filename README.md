# API de teste - Histórico de campanhas Digisac (GX Consultoria)

Projeto mínimo em Node/Express para testar a leitura de campanhas e exportação de resultados
da API Digisac (`/campaigns` e `/campaigns/export/csv`).

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar .env

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` e coloque seu token real da Digisac:

```env
DIGISAC_BASE_URL=https://gxconsultoria.digisac.biz
DIGISAC_API_PREFIX=/api/v1 # opcional, deixe vazio se já embutiu o /api/v1 na URL base
DIGISAC_TOKEN=SEU_TOKEN_AQUI
PORT=3001
```

> **Importante:** nunca commitar o `.env` no GitHub.

## 3. Rodar o projeto

```bash
npm start
```

Ou em modo desenvolvimento (requer `nodemon` instalado localmente via devDependency):

```bash
npm run dev
```

A API vai subir em `http://localhost:3001`.

## 4. Endpoints disponíveis

### `GET /`

Apenas um teste rápido para ver se a API está rodando.

### `GET /historico-digisac`

Lista campanhas da Digisac com filtros opcionais.

Parâmetros de query:

- `dataInicio` (opcional): ISO string (`2024-05-01T00:00:00.000Z`)
- `dataFim` (opcional): ISO string (`2024-05-31T23:59:59.000Z`)
- `page` (opcional): página (padrão `1`)
- `perPage` (opcional): itens por página (padrão `50`)
- `botTag` (opcional): nome da tag usada para identificar campanhas do robô
- `serviceId` (opcional): id do serviço (ex: conexão específica de WhatsApp)

Exemplo:

```bash
curl "http://localhost:3001/historico-digisac?dataInicio=2024-05-01T00:00:00.000Z&dataFim=2024-05-31T23:59:59.000Z"
```

### `GET /historico-digisac/campanha/:id/exportar`

Exporta os resultados de uma campanha específica utilizando o endpoint
`/campaigns/export/csv` da Digisac.

Parâmetros de query:

- `formataJson` (opcional): se `"false"`, retorna o CSV bruto.
  Qualquer outro valor (ou ausência) retorna JSON parseado.

Exemplo - JSON parseado:

```bash
curl "http://localhost:3001/historico-digisac/campanha/ID_DA_CAMPANHA/exportar"
```

Exemplo - CSV bruto:

```bash
curl "http://localhost:3001/historico-digisac/campanha/ID_DA_CAMPANHA/exportar?formataJson=false"
```

### `GET /historico-digisac/tickets/estatisticas`

Agrupa os tickets da Digisac para montar um dashboard de atendimento (clientes que
mais chamaram, atendentes com mais tickets, totais abertos/fechados e distribuição).

Parâmetros de query (todos opcionais):

- `dataInicio`: filtra por `updatedAt` maior ou igual a esta data.
- `dataFim`: filtra por `updatedAt` menor ou igual a esta data.
- `serviceId`: limita a uma conexão específica.
- `isOpen`: `true` ou `false` para filtrar por status.
- `perPage`: quantidade de registros por página na API da Digisac (padrão 200).

Exemplo:

```bash
curl "http://localhost:3001/historico-digisac/tickets/estatisticas?dataInicio=2024-01-01T00:00:00.000Z&dataFim=2024-01-31T23:59:59.000Z"
```

---

Depois de testar, você pode adaptar este projeto para salvar os dados em banco,
integrar com painel, etc.

## 5. Frontend com Vite/React

Uma interface em Vite está disponível em `frontend/` para visualizar o dashboard.

```bash
cd frontend
npm install
npm run dev
```

Configure a variável `VITE_API_URL` em um `.env` dentro de `frontend/` (padrão
`http://localhost:3001`) caso o backend rode em outra porta ou host.
