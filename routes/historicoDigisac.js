const express = require('express');
const router = express.Router();
const { listarCampanhas, exportarResultadosCampanha, obterEstatisticasTickets } = require('../services/digisacService');
const { parse } = require('csv-parse/sync');

router.get('/', async (req, res) => {
  try {
    const { dataInicio, dataFim, page, perPage, botTag, serviceId } = req.query;

    const campanhas = await listarCampanhas({
      dataInicio,
      dataFim,
      page: Number(page) || 1,
      perPage: Number(perPage) || 50,
      botTag,
      serviceId
    });

    const listaBruta = campanhas.data || campanhas;

    const resposta = listaBruta.map((c) => ({
      id: c.id,
      titulo: c.title || c.name,
      createdAt: c.createdAt,
      canal: c.service?.name,
      tags: c.tags?.map((t) => t.name),
      criadoPor: c.createdBy?.name,
      enviadoPor: c.sentBy?.name
    }));

    res.json({
      filtros: { dataInicio, dataFim, botTag, serviceId },
      total: campanhas.meta?.total || resposta.length,
      campanhas: resposta
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: true, mensagem: err.message });
  }
});

router.get('/campanha/:id/exportar', async (req, res) => {
  try {
    const { id } = req.params;
    const { formataJson = 'true' } = req.query;

    const csv = await exportarResultadosCampanha(id);

    if (formataJson === 'false') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      return res.send(csv);
    }

    const registros = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';'
    });

    res.json({
      campanhaId: id,
      totalRegistros: registros.length,
      registros
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: true, mensagem: err.message });
  }
});

router.get('/tickets/estatisticas', async (req, res) => {
  try {
    const { dataInicio, dataFim, serviceId, isOpen, perPage } = req.query;

    const estatisticas = await obterEstatisticasTickets({
      dataInicio,
      dataFim,
      serviceId,
      perPage: Number(perPage) || 200,
      isOpen: typeof isOpen === 'string' ? isOpen === 'true' : undefined
    });

    res.json(estatisticas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: true, mensagem: err.message });
  }
});

module.exports = router;
