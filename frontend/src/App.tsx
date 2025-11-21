import { useMemo, useState } from 'react';
import FilterBar from './components/FilterBar';
import { fetchDashboardStats } from './api';
import './index.css';
import type { DashboardStats, FilterState } from './types';

const formatNumber = (value: number | string | undefined | null) =>
  typeof value === 'number' ? value.toLocaleString('pt-BR') : value || '--';

function createDefaultFilters(): FilterState {
  const fim = new Date();
  const inicio = new Date();
  inicio.setDate(fim.getDate() - 6);

  const formatDate = (date: Date) => date.toISOString().slice(0, 10);

  return {
    dataInicio: formatDate(inicio),
    dataFim: formatDate(fim),
    tags: '',
    status: ''
  };
}

function App() {
  const [filters, setFilters] = useState<FilterState>(createDefaultFilters);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtrosFormatados = useMemo(
    () => ({
      ...filters,
      dataInicio: filters.dataInicio ? `${filters.dataInicio}T00:01:00` : undefined,
      dataFim: filters.dataFim ? `${filters.dataFim}T23:59:00` : undefined,
      status: filters.status || undefined
    }),
    [filters]
  );

  const totalAbertos = stats?.resumo.totalAbertos ?? 0;
  const totalFechados = stats?.resumo.totalFechados ?? 0;
  const totalChamados = stats?.resumo.totalChamados ?? stats?.resumo.totalTickets ?? totalAbertos + totalFechados;

  const carregarDados = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardStats(filtrosFormatados);
      setStats(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado ao buscar estatísticas';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(createDefaultFilters());
    setStats(null);
    setError(null);
  };

  return (
    <div className="page">
      <aside className="nav-drawer" aria-label="Menu principal">
        <div className="brand-block">
          <div className="brand-icon">GX</div>
          <div>
            <p className="brand-subtitle">CX Operações</p>
            <h1>DASHBOARD GX CONSULTORIA</h1>
          </div>
        </div>

        <nav className="nav-menu" aria-label="Navegação principal">
          {["Dashboard", "Relatórios", "Atendimentos", "Configurações"].map((item, index) => (
            <div key={item} className={`nav-item ${index === 0 ? 'is-active' : ''}`}>
              <span className="nav-icon">{(index + 1).toString().padStart(2, '0')}</span>
              <span>{item}</span>
            </div>
          ))}
        </nav>

        <div className="nav-secondary">
          <strong>Profissional Tecnológico</strong>
          <p>Slide bar à esquerda com navegação clara e foco na execução.</p>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h2 className="page-title">Visão geral e resumo</h2>
          </div>
          <div className="top-actions">
            <button className="btn outline" onClick={handleReset} disabled={loading}>
              Limpar filtros
            </button>
            <button className="btn primary" onClick={carregarDados} disabled={loading}>
              {loading ? 'Atualizando...' : 'Aplicar filtros'}
            </button>
          </div>
        </header>

        <section className="card filters-card">
          <div>
            <p className="eyebrow">Filtros de consulta</p>
            <h3>Carregue dados somente ao aplicar o filtro</h3>
          </div>
          <FilterBar filters={filters} onChange={setFilters} onSubmit={carregarDados} onReset={handleReset} loading={loading} />
        </section>

        {error && <div className="alert error">{error}</div>}

        <section className="stats-grid" aria-label="Resumo de atendimentos">
          <article className="stat-card">
            <p className="label">Total no período</p>
            <h3>{formatNumber(totalChamados)}</h3>
            <div className="stat-meta">
              <span className="stat-pill">Últimos 7 dias</span>
              <span>Datas aplicadas conforme filtro</span>
            </div>
          </article>
          <article className="stat-card alt">
            <p className="label">Abertos</p>
            <h3>{formatNumber(totalAbertos)}</h3>
            <div className="stat-meta">
              <span className="stat-pill">Status aberto</span>
            </div>
          </article>
          <article className="stat-card warning">
            <p className="label">Fechados</p>
            <h3>{formatNumber(totalFechados)}</h3>
            <div className="stat-meta">
              <span className="stat-pill">Status fechado</span>
            </div>
          </article>
          <article className="stat-card alt">
            <p className="label">Atendentes listados</p>
            <h3>{formatNumber(stats?.quantidadePorAtendente?.length ?? 0)}</h3>
            <div className="stat-meta">
              <span className="stat-pill">Sem limitação</span>
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Equipe</p>
                <h3>Total de atendimentos por atendente</h3>
              </div>
              <span className="metric-badge">Volume</span>
            </div>
            {stats?.quantidadePorAtendente?.length ? (
              <ul className="list">
                {stats.quantidadePorAtendente.map((item) => (
                  <li key={item.nome} className="list-row">
                    <div>
                      <p className="row-title">{item.nome}</p>
                    </div>
                    <span className="metric-badge">{formatNumber(item.quantidade)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">Aplique um filtro para ver os atendentes com mais volume.</p>
            )}
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Contatos</p>
                <h3>Contatos com mais atendimentos</h3>
              </div>
              <span className="metric-badge">Ranking</span>
            </div>
            {stats?.topClientes?.length ? (
              <ul className="list">
                {stats.topClientes.map((item) => (
                  <li key={item.nome} className="list-row">
                    <div>
                      <p className="row-title">{item.nome}</p>
                      {item.canal && <p className="row-subtitle">Canal: {item.canal}</p>}
                    </div>
                    <span className="metric-badge">{formatNumber(item.quantidade)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">Nenhum contato listado. Ajuste filtros e clique em aplicar.</p>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}

export default App;
