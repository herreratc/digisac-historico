import { useMemo, useState } from 'react';
import { fetchDashboardStats } from './api';
import DataPanel, { type PanelItem } from './components/DataPanel';
import FilterBar from './components/FilterBar';
import MetricCard from './components/MetricCard';
import PageHeader from './components/PageHeader';
import Sidebar from './components/Sidebar';
import './index.css';
import type { DashboardStats, FilterState } from './types';
import { formatDateISO, formatNumber } from './utils/formatters';

function createDefaultFilters(): FilterState {
  const fim = new Date();
  const inicio = new Date();
  inicio.setDate(fim.getDate() - 6);

  return {
    dataInicio: formatDateISO(inicio),
    dataFim: formatDateISO(fim),
    tags: '',
    status: ''
  };
}

const NAV_ACTIONS = [
  { label: 'Limpar filtros', variant: 'ghost' as const },
  { label: 'Aplicar filtros', variant: 'primary' as const }
];

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

  const statCards = [
    {
      label: 'Total no período',
      value: formatNumber(totalChamados),
      helper: 'Com base nas datas aplicadas',
      tone: 'primary' as const
    },
    {
      label: 'Abertos',
      value: formatNumber(totalAbertos),
      helper: 'Status aberto',
      tone: 'success' as const
    },
    {
      label: 'Fechados',
      value: formatNumber(totalFechados),
      helper: 'Status fechado',
      tone: 'warning' as const
    },
    {
      label: 'Atendentes listados',
      value: formatNumber(stats?.quantidadePorAtendente?.length ?? 0),
      helper: 'Sem limitação',
      tone: 'neutral' as const
    }
  ];

  const atendenteItems: PanelItem[] = (stats?.quantidadePorAtendente || []).map((item) => ({
    id: item.nome,
    title: item.nome,
    value: formatNumber(item.quantidade)
  }));

  const clientesItems: PanelItem[] = (stats?.topClientes || []).map((item) => ({
    id: item.nome,
    title: item.nome,
    subtitle: item.canal ? `Canal: ${item.canal}` : undefined,
    value: formatNumber(item.quantidade)
  }));

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

  const actionButtons = NAV_ACTIONS.map((action) => {
    const isPrimary = action.variant === 'primary';
    const onClick = isPrimary ? carregarDados : handleReset;

    return (
      <button
        key={action.label}
        className={`btn ${isPrimary ? 'btn--primary' : 'btn--ghost'}`}
        onClick={onClick}
        disabled={loading}
        type="button"
      >
        {isPrimary ? (loading ? 'Atualizando...' : action.label) : action.label}
      </button>
    );
  });

  return (
    <div className="layout">
      <Sidebar />

      <div className="main" aria-busy={loading}>
        <PageHeader title="Visão geral e resumo" subtitle="Dashboard" actions={actionButtons} />

        <section className="card filters-card">
          <div>
            <p className="eyebrow">Filtros de consulta</p>
            <h3 className="section-title">Carregue dados somente ao aplicar o filtro</h3>
          </div>
          <FilterBar filters={filters} onChange={setFilters} onSubmit={carregarDados} onReset={handleReset} loading={loading} />
        </section>

        {error && (
          <div className="alert alert--error" role="status">
            {error}
          </div>
        )}

        <section className="stat-grid" aria-label="Resumo de atendimentos">
          {statCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </section>

        <section className="content-grid">
          <DataPanel
            title="Total de atendimentos por atendente"
            eyebrow="Equipe"
            badge="Volume"
            items={atendenteItems}
            loading={loading}
            emptyMessage="Aplique um filtro para ver os atendentes com mais volume."
          />

          <DataPanel
            title="Contatos com mais atendimentos"
            eyebrow="Contatos"
            badge="Ranking"
            items={clientesItems}
            loading={loading}
            emptyMessage="Nenhum contato listado. Ajuste filtros e clique em aplicar."
          />
        </section>
      </div>
    </div>
  );
}

export default App;
