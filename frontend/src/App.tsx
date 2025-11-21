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

  const statusDistribuicao = useMemo(() => {
    const abertos = stats?.resumo.totalAbertos ?? 0;
    const fechados = stats?.resumo.totalFechados ?? 0;
    const total = abertos + fechados;

    if (!total) {
      return null;
    }

    return {
      abertos,
      fechados,
      porcentagemAbertos: Math.round((abertos / total) * 100),
      porcentagemFechados: Math.round((fechados / total) * 100)
    };
  }, [stats]);

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

  const totalChamados = stats?.resumo.totalChamados ?? stats?.resumo.totalTickets;

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

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">Digisac Insight</div>
        <div className="topbar__actions">
          <span className="pill pill--outline">Console premium</span>
          <span className="pill pill--ghost">React + TypeScript</span>
        </div>
      </header>

      <section className="hero">
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="pill pill--outline">Monitoramento</span>
            <span className="divider" />
            <p>Operação Digisac</p>
          </div>
          <h1>Histórico de atendimentos em tempo real</h1>
          <p className="hero__subtitle">
            Uma visão premium e responsiva das conversas, construída em TypeScript + Vite para entregar performance, clareza e confiança.
          </p>
          <div className="hero__meta">
            <span className="pill pill--solid">
              {stats ? `${formatNumber(totalChamados ?? 0)} chamados processados` : 'Carregando dados...'}
            </span>
            <span className="pill pill--ghost">
              {lastUpdated ? `Atualizado às ${lastUpdated.toLocaleTimeString('pt-BR')}` : 'Aguardando atualização'}
            </span>
          </div>
          <div className="hero__highlights">
            <div>
              <p className="eyebrow">Camada executiva</p>
              <p className="hero__highlight-text">Layout full com contraste, glow e cartões de elite para stakeholders.</p>
            </div>
            <div>
              <p className="eyebrow">Performance</p>
              <p className="hero__highlight-text">Stack moderna (Vite + TS) garantindo builds rápidos e UX suave.</p>
            </div>
            <div>
              <p className="eyebrow">Foco em clareza</p>
              <p className="hero__highlight-text">Filtros, gráficos e rankings em um grid master, pronto para operação.</p>
            </div>
          </div>
        </div>
        <div className="hero__glow" aria-hidden="true" />
      </section>

      <section className="status-ribbon" aria-label="Informações do painel">
        <div className="status-ribbon__item">
          <p className="eyebrow">Momento</p>
          <p className="status-ribbon__value">{lastUpdated ? lastUpdated.toLocaleTimeString('pt-BR') : 'Live'}</p>
          <p className="status-ribbon__caption">Latência ultra baixa para analistas.</p>
        </div>
        <div className="status-ribbon__item">
          <p className="eyebrow">Filtros ativos</p>
          <p className="status-ribbon__value">{filtrosAplicados}</p>
          <p className="status-ribbon__caption">Combinações inteligentes aplicadas na consulta.</p>
        </div>
        <div className="status-ribbon__item">
          <p className="eyebrow">Dataset</p>
          <p className="status-ribbon__value">{formatNumber(totalChamados ?? '--')}</p>
          <p className="status-ribbon__caption">Eventos processados na janela selecionada.</p>
        </div>
        <div className="status-ribbon__item">
          <p className="eyebrow">Modo</p>
          <p className="status-ribbon__value">Operação 24/7</p>
          <p className="status-ribbon__caption">Pronto para lideranças e squads.</p>
        </div>
      </section>

      <main className="page">
        <section className="panel panel--floating">
          <div className="panel__title">
            <div>
              <p className="eyebrow">Filtros avançados</p>
              <h2 className="panel__headline">Defina o recorte da análise</h2>
              <p className="panel__description">
                Combine data e status para encontrar padrões de volume, tempo de resposta e equilíbrio entre atendentes.
              </p>
            </div>
            <div className="panel__hint">Use TAB para navegar rapidamente entre os campos.</div>
          </div>
          <FilterBar filters={filters} onChange={setFilters} onSubmit={carregarDados} loading={loading} />
        </section>

        {error && <div className="alert alert--error">{error}</div>}

        <section className="grid stats-grid">
          <StatCard
            label="Total de chamados"
            value={formatNumber(totalChamados ?? '--')}
            caption="Movimentações totais no período."
            highlight
          />
          <StatCard
            label="Chamados abertos"
            value={formatNumber(stats?.resumo.totalAbertos ?? '--')}
            caption="Aguardando retorno ou resolução."
          />
          <StatCard
            label="Chamados fechados"
            value={formatNumber(stats?.resumo.totalFechados ?? '--')}
            caption="Conversas finalizadas com cliente."
          />
          <StatCard
            label="Filtros aplicados"
            value={filtrosAplicados}
            caption="Quantos critérios estão ativos na pesquisa."
          />
        </section>

        <section className="grid insight-grid">
          <InsightCard title="Saúde dos chamados" subtitle="Distribuição entre abertos e fechados">
            {statusDistribuicao ? (
              <div className="insight-grid__content">
                <DonutChart
                  abertos={statusDistribuicao.abertos}
                  fechados={statusDistribuicao.fechados}
                  porcentagemAbertos={statusDistribuicao.porcentagemAbertos}
                  porcentagemFechados={statusDistribuicao.porcentagemFechados}
                />
                <div className="insight-grid__legend">
                  <div>
                    <p className="legend__label">Abertos</p>
                    <p className="legend__value">{formatNumber(statusDistribuicao.abertos)} chamados</p>
                  </div>
                  <div>
                    <p className="legend__label">Fechados</p>
                    <p className="legend__value">{formatNumber(statusDistribuicao.fechados)} chamados</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="empty">Os filtros ainda não retornaram volume para exibir o gráfico.</p>
            )}
          </InsightCard>

          <InsightCard title="Carga por atendente" subtitle="Top filas que mais receberam chamados">
            {cargaPorAtendente.length ? (
              <BarChart
                data={cargaPorAtendente.map((item) => ({ label: item.nome, value: item.quantidade }))}
                color="#6366f1"
              />
            ) : (
              <p className="empty">Nenhuma movimentação para o período selecionado.</p>
            )}
          </InsightCard>
        </section>

        <section className="grid two-columns">
          <Leaderboard title="Clientes que mais chamaram" items={stats?.topClientes || []} descriptionKeys={["canal", "ultimoAtendimento"]} />
          <Leaderboard title="Atendentes com mais chamados" items={stats?.atendentesComMaisAtendimentos || []} descriptionKeys={[]} />
        </section>

        <section className="panel">
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
  );
}

export default App;
