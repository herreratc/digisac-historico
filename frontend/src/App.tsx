import { useMemo, useState } from 'react';
import FilterBar from './components/FilterBar';
import { fetchDashboardStats } from './api';
import './index.css';
import type { DashboardStats, FilterState } from './types';

const PAGE_SIZE = 1000;

const formatNumber = (value: number | string | undefined | null) =>
  typeof value === 'number' ? value.toLocaleString('pt-BR') : value || '--';

function createDefaultFilters(): FilterState {
  const fim = new Date();
  const inicio = new Date();
  inicio.setDate(fim.getDate() - 6);
  inicio.setHours(0, 0, 0, 0);
  fim.setHours(23, 59, 0, 0);

  const formatDate = (date: Date) => date.toISOString().slice(0, 16);

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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const filtrosFormatados = useMemo(
    () => ({
      ...filters,
      status: filters.status || undefined,
      perPage: PAGE_SIZE
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
      setLastUpdated(new Date());
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
    setLastUpdated(null);
    setError(null);
  };

  return (
    <div className="app-shell">
      <header className="page-header">
        <div className="brand">
          <span className="brand-dot" aria-hidden>
            •
          </span>
          <div>
            <p className="brand-label">CX Operações</p>
            <h1>DASHBOARD GX CONSULTORIA</h1>
            <p className="brand-subtitle">Visão simplificada dos atendimentos com filtros acionados apenas sob demanda.</p>
          </div>
        </div>
        <nav className="slide-menu" aria-label="Navegação principal">
          {['Dashboard', 'Relatório Excel/PDF', 'Atendimentos aberto agora'].map((item) => (
            <div key={item} className="slide-item">
              <span>{item}</span>
            </div>
          ))}
        </nav>
      </header>

      <section className="filters-card">
        <div>
          <p className="eyebrow">Filtros de consulta</p>
          <h2>Carregue dados somente ao aplicar o filtro</h2>
          <p className="helper-text">Por padrão, considere o recorte dos últimos 7 dias. Ajuste as opções abaixo e clique em "Aplicar filtros".</p>
        </div>
        <FilterBar filters={filters} onChange={setFilters} onSubmit={carregarDados} onReset={handleReset} loading={loading} />
      </section>

      {error && <div className="alert alert--error">{error}</div>}

      <main className="content-grid">
        <section className="stat-card highlight">
          <div>
            <p className="eyebrow">Total de atendimentos no período</p>
            <h2>{formatNumber(totalChamados)}</h2>
          </div>
          <div className="meta">
            <span>Última atualização</span>
            <strong>{lastUpdated ? lastUpdated.toLocaleString('pt-BR') : 'Aguardando aplicação do filtro'}</strong>
          </div>
        </section>

        <div className="panels">
          <section className="panel">
            <div className="panel-header">
              <h3>Total de atendimentos por atendente</h3>
              <p>Resultado limitado aos {PAGE_SIZE.toLocaleString('pt-BR')} primeiros registros retornados.</p>
            </div>
            {stats?.quantidadePorAtendente?.length ? (
              <ul className="list">
                {stats.quantidadePorAtendente.map((item) => (
                  <li key={item.nome} className="list-row">
                    <span>{item.nome}</span>
                    <strong>{formatNumber(item.quantidade)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">Nenhum atendente listado. Aplique um filtro para ver o resultado.</p>
            )}
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3>Contatos com mais atendimentos</h3>
              <p>Exibe clientes/contatos que mais abriram chamados no período filtrado.</p>
            </div>
            {stats?.topClientes?.length ? (
              <ul className="list">
                {stats.topClientes.map((item) => (
                  <li key={item.nome} className="list-row">
                    <div>
                      <p className="item-title">{item.nome}</p>
                      {item.canal && <p className="item-subtitle">Canal: {item.canal}</p>}
                    </div>
                    <strong>{formatNumber(item.quantidade)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">Nenhum contato encontrado. Ajuste os filtros e clique em aplicar.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
