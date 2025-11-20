require('dotenv').config();
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const BASE_URL = process.env.DIGISAC_BASE_URL;
const TOKEN = process.env.DIGISAC_TOKEN;
const API_PREFIX = process.env.DIGISAC_API_PREFIX || '';
const NORMALIZED_PREFIX = API_PREFIX ? (API_PREFIX.startsWith('/') ? API_PREFIX : `/${API_PREFIX}`) : '';

if (!BASE_URL) {
  console.warn('⚠️ DIGISAC_BASE_URL não definido no .env');
}
if (!TOKEN) {
  console.warn('⚠️ DIGISAC_TOKEN não definido no .env');
}

function buildQueryParam(obj) {
  return new URLSearchParams({ query: JSON.stringify(obj) }).toString();
}

function withPrefix(path) {
  return `${NORMALIZED_PREFIX}${path}`;
}

async function executarRequisicao(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const resposta = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(options.headers || {})
    }
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    throw new Error(`Erro na chamada para ${endpoint}: ${resposta.status} - ${texto}`);
  }

  return resposta;
}

async function listarCampanhas({ dataInicio, dataFim, page = 1, perPage = 50, botTag, serviceId }) {
  const whereAnd = [];

  if (dataInicio) {
    whereAnd.push({ createdAt: { $gte: dataInicio } });
  }
  if (dataFim) {
    whereAnd.push({ createdAt: { $lte: dataFim } });
  }

  if (serviceId) {
    whereAnd.push({ serviceId });
  }

  if (botTag) {
    whereAnd.push({ '$tags.name$': botTag });
  }

  const query = {
    order: [['createdAt', 'DESC']],
    include: [
      { model: 'service' },
      { model: 'tags' },
      { model: 'messages', include: [{ model: 'file' }] },
      { model: 'createdBy', attributes: ['id', 'name'] },
      { model: 'sentBy', attributes: ['id', 'name'] }
    ],
    page,
    perPage
  };

  if (whereAnd.length > 0) {
    query.where = { $and: whereAnd };
  }

  const qs = buildQueryParam(query);

  const res = await executarRequisicao(withPrefix(`/campaigns?${qs}`));
  return res.json();
}

async function exportarResultadosCampanha(campaignId, type = 'semiColon') {
  const res = await fetch(`${BASE_URL}${withPrefix('/campaigns/export/csv')}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      where: { campaignId },
      type
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao exportar CSV da campanha: ${res.status} - ${text}`);
  }

  const csv = await res.text();
  return csv;
}

async function buscarTickets({ dataInicio, dataFim, serviceId, page = 1, perPage = 200, isOpen }) {
  const whereAnd = [];

  if (dataInicio) {
    whereAnd.push({ updatedAt: { $gte: dataInicio } });
  }

  if (dataFim) {
    whereAnd.push({ updatedAt: { $lte: dataFim } });
  }

  if (typeof isOpen === 'boolean') {
    whereAnd.push({ isOpen });
  }

  if (serviceId) {
    whereAnd.push({ serviceId });
  }

  const query = {
    distinct: true,
    order: [['updatedAt', 'DESC']],
    include: [
      {
        model: 'contact',
        attributes: ['id', 'name', 'alternativeName', 'internalName', 'serviceId', 'status'],
        required: true,
        where: { visible: true },
        include: [{ model: 'service', attributes: ['id', 'name'] }]
      },
      { model: 'user', attributes: ['id', 'name', 'email'] },
      { model: 'department', attributes: ['id', 'name'] }
    ],
    page,
    perPage
  };

  if (whereAnd.length > 0) {
    query.where = { $and: whereAnd };
  }

  const qs = buildQueryParam(query);
  const resposta = await executarRequisicao(withPrefix(`/tickets?${qs}`));
  return resposta.json();
}

async function buscarTicketsAteCompletar(filtros) {
  const todosOsTickets = [];
  let pagina = 1;

  while (true) {
    const resultado = await buscarTickets({ ...filtros, page: pagina });
    const registros = resultado.data || resultado || [];
    const total = resultado.meta?.total;

    if (registros.length === 0) {
      break;
    }

    todosOsTickets.push(...registros);

    if (!total || todosOsTickets.length >= total) {
      break;
    }

    pagina += 1;
    if (pagina > 50) {
      // Evita loops infinitos caso a API não retorne meta.total
      break;
    }
  }

  return todosOsTickets;
}

function normalizarNomeContato(contato) {
  return contato?.name || contato?.alternativeName || contato?.internalName || 'Contato sem nome';
}

function calcularEstatisticasTickets(tickets) {
  const totalTickets = tickets.length;
  const totalAbertos = tickets.filter((t) => t.isOpen).length;
  const totalFechados = totalTickets - totalAbertos;

  const contagemClientes = new Map();
  const contagemAtendentes = new Map();

  tickets.forEach((ticket) => {
    const cliente = normalizarNomeContato(ticket.contact);
    const atendente = ticket.user?.name || 'Sem atendente';

    const ultimoAtendimento = contagemClientes.has(cliente)
      ? new Date(
          Math.max(
            new Date(contagemClientes.get(cliente).ultimoAtendimento).getTime(),
            new Date(ticket.updatedAt).getTime()
          )
        ).toISOString()
      : ticket.updatedAt;

    const atualCliente = contagemClientes.get(cliente) || { quantidade: 0, ultimoAtendimento: null, service: ticket.contact?.service?.name };
    contagemClientes.set(cliente, {
      quantidade: atualCliente.quantidade + 1,
      ultimoAtendimento,
      service: atualCliente.service || ticket.contact?.service?.name
    });

    const atualAtendente = contagemAtendentes.get(atendente) || 0;
    contagemAtendentes.set(atendente, atualAtendente + 1);
  });

  const rankingClientes = Array.from(contagemClientes.entries())
    .map(([nome, info]) => ({ nome, quantidade: info.quantidade, ultimoAtendimento: info.ultimoAtendimento, canal: info.service }))
    .sort((a, b) => b.quantidade - a.quantidade);

  const rankingAtendentes = Array.from(contagemAtendentes.entries())
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);

  return {
    resumo: {
      totalTickets,
      totalAbertos,
      totalFechados
    },
    topClientes: rankingClientes.slice(0, 5),
    atendentesComMaisAtendimentos: rankingAtendentes.slice(0, 5),
    quantidadePorAtendente: rankingAtendentes
  };
}

async function obterEstatisticasTickets(filtros) {
  const tickets = await buscarTicketsAteCompletar(filtros);
  const estatisticas = calcularEstatisticasTickets(tickets);

  return {
    filtros,
    totalRegistrosProcessados: tickets.length,
    ...estatisticas
  };
}

module.exports = {
  listarCampanhas,
  exportarResultadosCampanha,
  obterEstatisticasTickets
};
