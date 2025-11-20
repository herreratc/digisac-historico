import { useEffect, useMemo, useState } from 'react';
import FilterBar from './components/FilterBar';
import Leaderboard from './components/Leaderboard';
import StatCard from './components/StatCard';
import { fetchDashboardStats } from './api';
import './index.css';

function App() {
  const [filters, setFilters] = useState({ dataInicio: '', dataFim: '', serviceId: '', isOpen: '' });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filtrosFormatados = useMemo(
    () => ({
      ...filters,
      isOpen: filters.isOpen === '' ? undefined : filters.isOpen
    }),
    [filters]
  );

  const carregarDados = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardStats(filtrosFormatados);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page">
      <header className="page__header">
        <div>
          <p className="page__eyebrow">Dashboard</p>
          <h1>Histórico de atendimentos (WhatsApp / Digisac)</h1>
          <p className="page__subtitle">Filtros de data e serviço para acompanhar volume e performance.</p>
        </div>
        <div className="chip">{stats ? `${stats.totalRegistrosProcessados} tickets processados` : 'Sem dados'}</div>
      </header>

      <FilterBar filters={filters} onChange={setFilters} onSubmit={carregarDados} loading={loading} />

      {error && <div className="alert alert--error">{error}</div>}

      <section className="grid stats-grid">
        <StatCard label="Total de chamados" value={stats?.resumo.totalTickets ?? '--'} highlight />
        <StatCard label="Chamados abertos" value={stats?.resumo.totalAbertos ?? '--'} />
        <StatCard label="Chamados fechados" value={stats?.resumo.totalFechados ?? '--'} />
        <StatCard label="Filtros aplicados" value={stats ? Object.keys(filtrosFormatados).filter((k) => filtrosFormatados[k]).length : '--'} />
      </section>

      <section className="grid two-columns">
        <Leaderboard
          title="Clientes que mais chamaram"
          items={stats?.topClientes || []}
          descriptionKeys={["canal", "ultimoAtendimento"]}
        />
        <Leaderboard
          title="Atendentes com mais tickets"
          items={stats?.atendentesComMaisAtendimentos || []}
          descriptionKeys={[]}
        />
      </section>

      <section className="panel">
        <div className="panel__header">
          <h3>Distribuição de tickets por atendente</h3>
          <span className="pill">{stats?.quantidadePorAtendente?.length || 0} atendentes</span>
        </div>
        {stats?.quantidadePorAtendente?.length ? (
          <div className="table">
            <div className="table__row table__row--head">
              <span>Atendente</span>
              <span>Total</span>
            </div>
            {stats.quantidadePorAtendente.map((item) => (
              <div key={item.nome} className="table__row">
                <span>{item.nome}</span>
                <span className="pill pill--muted">{item.quantidade}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">Nenhum ticket retornado para os filtros selecionados.</p>
        )}
      </section>
    </main>
  );
}

export default App;
