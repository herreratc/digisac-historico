import { useEffect, useMemo, useState } from 'react';
import BarChart from './components/BarChart';
import DonutChart from './components/DonutChart';
import FilterBar from './components/FilterBar';
import InsightCard from './components/InsightCard';
import Leaderboard from './components/Leaderboard';
import StatCard from './components/StatCard';
import { fetchDashboardStats } from './api';
import './index.css';
import type { DashboardStats, FilterState } from './types';

const PAGE_SIZE = 1000;

const formatNumber = (value: number | string | undefined | null) =>
  typeof value === 'number' ? value.toLocaleString('pt-BR') : value || '--';

function App() {
  const [filters, setFilters] = useState<FilterState>({ dataInicio: '', dataFim: '', serviceId: '', isOpen: '' });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const filtrosFormatados = useMemo(
    () => ({
      ...filters,
      isOpen: filters.isOpen === '' ? undefined : filters.isOpen,
      perPage: PAGE_SIZE
    }),
    [filters]
  );

  const totalChamados = stats?.resumo.totalChamados ?? stats?.resumo.totalTickets ?? 0;
  const totalAbertos = stats?.resumo.totalAbertos ?? 0;
  const totalFechados = stats?.resumo.totalFechados ?? 0;
  const total = totalAbertos + totalFechados || totalChamados;

  const statusDistribuicao = useMemo(() => {
    if (!total) return null;
    return {
      abertos: totalAbertos,
      fechados: totalFechados,
      porcentagemAbertos: Math.round((totalAbertos / total) * 100),
      porcentagemFechados: Math.round((totalFechados / total) * 100)
    };
  }, [total, totalAbertos, totalFechados]);

  const slaAtendido = statusDistribuicao?.porcentagemFechados ?? 0;
  const slaExtrapolado = statusDistribuicao?.porcentagemAbertos ?? 0;
  const slaExtrapoladoMais = Math.max(0, slaExtrapolado - 5);

  const cargaPorAtendente = useMemo(() => {
    if (!stats?.quantidadePorAtendente?.length) return [];

    const topAtendentes = stats.quantidadePorAtendente.slice(0, 7);
    const restante = stats.quantidadePorAtendente.slice(7);

    if (restante.length) {
      const outros = restante.reduce((acc, curr) => acc + curr.quantidade, 0);
      topAtendentes.push({ nome: 'Outros', quantidade: outros });
    }

    return topAtendentes;
  }, [stats]);

  const carregarDados = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardStats(filtrosFormatados);
      setStats(data);
      setLastUpdated(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado ao buscar estatísticas';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrosAplicados = stats
    ? Object.entries(filtrosFormatados).filter(([, value]) => value !== undefined && value !== '').length
    : '--';

  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  return (
    <div className="dashboard-shell">
      <header className="dashboard-hero">
        <div className="brand-mark" aria-hidden="true">
          <span>DG</span>
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">SLA de atendimento · Operação Digisac</p>
          <h1>Visão executiva do histórico de chamados</h1>
          <p className="hero-subtitle">
            Monitore volumes, atendimento e distribuição em um painel escuro inspirado no layout fornecido. Tudo em tempo real,
            com filtros rápidos e gráficos responsivos.
          </p>
          <div className="hero-meta">
            <div>
              <p className="meta-label">Chamados processados</p>
              <p className="meta-value">{formatNumber(totalChamados)}</p>
            </div>
            <div>
              <p className="meta-label">Última atualização</p>
              <p className="meta-value">{lastUpdated ? lastUpdated.toLocaleTimeString('pt-BR') : 'Aguardando'}</p>
            </div>
            <div>
              <p className="meta-label">Filtros ativos</p>
              <p className="meta-value">{filtrosAplicados}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <aside className="filters-panel">
          <div className="panel-heading">
            <h3>Filtro de tempo</h3>
            <p>Selecione meses e anos para refinar o corte.</p>
          </div>
          <div className="months-list" role="list" aria-label="Meses do ano">
            {meses.map((mes) => (
              <span key={mes} className="month-pill" role="listitem">
                {mes}
              </span>
            ))}
          </div>
          <div className="year-grid" aria-label="Anos disponíveis">
            {[2021, 2022, 2023, 2024].map((ano) => (
              <div key={ano} className="year-card">
                <span className="year-label">{ano}</span>
                <span className="year-value">{Math.round(totalChamados / 4).toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>

          <div className="filter-card">
            <p className="eyebrow">Filtros avançados</p>
            <FilterBar filters={filters} onChange={setFilters} onSubmit={carregarDados} loading={loading} />
          </div>
          <div className="resume-card">
            <div>
              <p className="resume-label">Abertos</p>
              <p className="resume-value">{formatNumber(totalAbertos)}</p>
              <p className="resume-delta">+0,10% que o anterior</p>
            </div>
            <div className="resume-divider" />
            <div>
              <p className="resume-label">Atendidos</p>
              <p className="resume-value">{formatNumber(totalFechados)}</p>
              <p className="resume-delta resume-delta--good">-0,45% que o anterior</p>
            </div>
          </div>
        </aside>

        <main className="workspace">
          {error && <div className="alert alert--error">{error}</div>}

          <div className="summary-row">
            <div className="summary-card summary-card--warning">
              <div>
                <p className="eyebrow">Total em aberto</p>
                <p className="summary-value">{formatNumber(totalAbertos)}</p>
                <p className="summary-caption">Chamados aguardando resolução.</p>
              </div>
              <span className="trend-badge trend-badge--warning">-12,02%</span>
            </div>

            <div className="summary-card summary-card--gauge">
              <div className="summary-header">
                <div>
                  <p className="eyebrow">SLA atendido</p>
                  <p className="summary-caption">Distribuição entre abertos e fechados</p>
                </div>
                <span className="trend-badge trend-badge--good">+5,22%</span>
              </div>
              {statusDistribuicao ? (
                <div className="gauge-wrapper">
                  <DonutChart
                    abertos={statusDistribuicao.abertos}
                    fechados={statusDistribuicao.fechados}
                    porcentagemAbertos={statusDistribuicao.porcentagemAbertos}
                    porcentagemFechados={statusDistribuicao.porcentagemFechados}
                  />
                </div>
              ) : (
                <p className="empty">Nenhum volume retornado para o período.</p>
              )}
            </div>
          </div>

          <div className="mini-cards">
            <StatCard
              label="SLA Extrapolado"
              value={`${slaExtrapolado}%`}
              caption="Itens fora do prazo"
              highlight
            />
            <StatCard label="SLA Atendido" value={`${slaAtendido}%`} caption="Dentro do prazo" />
            <StatCard label="SLA Extrapolado +" value={`${slaExtrapoladoMais}%`} caption="Desvios críticos" />
            <StatCard label="Chamados" value={formatNumber(total)} caption="Volume total" />
            <StatCard label="Filtros" value={filtrosAplicados} caption="Critérios ativos" />
            <StatCard label="Momento" value={lastUpdated ? lastUpdated.toLocaleTimeString('pt-BR') : 'Live'} caption="Sincronização" />
          </div>

          <div className="charts-grid">
            <InsightCard title="Total em aberto por atendente" subtitle="Top filas com mais chamados abertos">
              {cargaPorAtendente.length ? (
                <BarChart
                  data={cargaPorAtendente.map((item) => ({ label: item.nome, value: item.quantidade }))}
                  color="#f59e0b"
                />
              ) : (
                <p className="empty">Nenhuma movimentação para o período selecionado.</p>
              )}
            </InsightCard>
            <InsightCard title="Total SLA extrapolado" subtitle="Abertos versus fechados">
              {statusDistribuicao ? (
                <div className="dual-status">
                  <div className="status-block">
                    <p className="status-number">{formatNumber(totalAbertos)}</p>
                    <p className="status-label">Em aberto</p>
                  </div>
                  <div className="status-block">
                    <p className="status-number">{formatNumber(totalFechados)}</p>
                    <p className="status-label">Atendido</p>
                  </div>
                </div>
              ) : (
                <p className="empty">Aplicar filtros para visualizar.</p>
              )}
            </InsightCard>
          </div>

          <div className="grid two-columns">
            <Leaderboard
              title="Total em aberto"
              items={stats?.topClientes || []}
              descriptionKeys={["canal", "ultimoAtendimento"]}
            />
            <Leaderboard title="SLA extrapolado +" items={stats?.atendentesComMaisAtendimentos || []} descriptionKeys={[]} />
          </div>

          <section className="panel table-panel">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Carga atual</p>
                <h3>Distribuição de chamados por atendente</h3>
              </div>
              <span className="pill">{stats?.quantidadePorAtendente?.length || 0} pessoas na operação</span>
            </div>
            {stats?.quantidadePorAtendente?.length ? (
              <div className="table" role="table" aria-label="Distribuição de chamados por atendente">
                <div className="table__row table__row--head" role="row">
                  <span role="columnheader">Atendente</span>
                  <span role="columnheader">Total</span>
                </div>
                {stats.quantidadePorAtendente.map((item) => (
                  <div key={item.nome} className="table__row" role="row">
                    <span role="cell">{item.nome}</span>
                    <span className="pill pill--muted" role="cell">{item.quantidade}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">Nenhum chamado retornado para os filtros selecionados.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
