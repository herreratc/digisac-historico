require('dotenv').config();
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const BASE_URL = process.env.DIGISAC_BASE_URL;
const TOKEN = process.env.DIGISAC_TOKEN;

if (!BASE_URL) {
  console.warn('⚠️ DIGISAC_BASE_URL não definido no .env');
}
if (!TOKEN) {
  console.warn('⚠️ DIGISAC_TOKEN não definido no .env');
}

function buildQueryParam(obj) {
  return new URLSearchParams({ query: JSON.stringify(obj) }).toString();
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
      'service',
      'tags',
      { model: 'messages', include: 'file' },
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

  const res = await fetch(`${BASE_URL}/campaigns?${qs}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao listar campanhas Digisac: ${res.status} - ${text}`);
  }

  return res.json();
}

async function exportarResultadosCampanha(campaignId, type = 'semiColon') {
  const res = await fetch(`${BASE_URL}/campaigns/export/csv`, {
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

module.exports = {
  listarCampanhas,
  exportarResultadosCampanha
};
