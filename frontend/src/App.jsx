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
  const [lastUpdated, setLastUpdated] = useState(null);

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
      setLastUpdated(new Date());
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

  const filtrosAplicados = stats
    ? Object.keys(filtrosFormatados).filter((key) => filtrosFormatados[key] !== undefined && filtrosFormatados[key] !== '').length
    : '--';

  return (
    <div className="shell">
      <section className="hero">
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="pill pill--outline">Monitoramento</span>
            <span className="divider" />
            <p>Operação Digisac</p>
          </div>
          <h1>Histórico de atendimentos</h1>
          <p className="hero__subtitle">
            Acompanhe a evolução dos tickets por período, serviço e status para responder rápido às mudanças de demanda.
          </p>
          <div className="hero__meta">
            <span className="pill pill--solid">
              {stats ? `${stats.totalRegistrosProcessados} registros processados` : 'Carregando dados...'}
            </span>
            <span className="pill pill--ghost">{lastUpdated ? `Atualizado às ${lastUpdated.toLocaleTimeString('pt-BR')}` : 'Aguardando atualização'}</span>
          </div>
        </div>
        <div className="hero__glow" aria-hidden="true" />
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
          <StatCard label="Total de chamados" value={stats?.resumo.totalTickets ?? '--'} caption="Movimentações totais no período." highlight />
          <StatCard label="Chamados abertos" value={stats?.resumo.totalAbertos ?? '--'} caption="Aguardando retorno ou resolução." />
          <StatCard label="Chamados fechados" value={stats?.resumo.totalFechados ?? '--'} caption="Conversas finalizadas com cliente." />
          <StatCard
            label="Filtros aplicados"
            value={filtrosAplicados}
            caption="Quantos critérios estão ativos na pesquisa."
          />
        </section>

        <section className="grid two-columns">
          <Leaderboard title="Clientes que mais chamaram" items={stats?.topClientes || []} descriptionKeys={["canal", "ultimoAtendimento"]} />
          <Leaderboard title="Atendentes com mais tickets" items={stats?.atendentesComMaisAtendimentos || []} descriptionKeys={[]} />
        </section>

        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Carga atual</p>
              <h3>Distribuição de tickets por atendente</h3>
            </div>
            <span className="pill">{stats?.quantidadePorAtendente?.length || 0} pessoas na operação</span>
          </div>
          {stats?.quantidadePorAtendente?.length ? (
            <div className="table" role="table" aria-label="Distribuição de tickets por atendente">
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
            <p className="empty">Nenhum ticket retornado para os filtros selecionados.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
