import { useEffect, useState } from 'react';
import { fetchClientNetwork } from './api';
import type { ClientNetwork, ClientTagGroup } from './types';
import './index.css';

function TagPill({ label }: { label: string }) {
  return <span className="pill">{label}</span>;
}

function GroupCard({ group }: { group: ClientTagGroup }) {
  return (
    <article className="card network-card">
      <header className="network-card__header">
        <div className="network-card__title">
          <p className="eyebrow">Tag</p>
          <h3>{group.tag}</h3>
        </div>
        <div className="network-card__count">
          <strong>{group.quantidade}</strong>
          <span>contatos</span>
        </div>
      </header>

      <div className="network-card__body">
        <p className="muted">Exemplos deste grupo</p>
        <ul className="network-card__list">
          {group.exemplos.map((contato) => (
            <li key={contato.id}>
              <span className="network-card__contact-name">{contato.nome}</span>
              {contato.canal && <span className="pill pill--muted">{contato.canal}</span>}
            </li>
          ))}
        </ul>
      </div>

      <footer className="network-card__footer">
        <div className="network-card__channels" aria-label="Canais com esta tag">
          {group.canais.length > 0 ? group.canais.map((canal) => <TagPill key={canal} label={canal} />) : <span className="muted">Sem canal informado</span>}
        </div>
        <span className="network-card__meta">Até 5 exemplos exibidos</span>
      </footer>
    </article>
  );
}

function ClientNetworkPage() {
  const [network, setNetwork] = useState<ClientNetwork | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarRede = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchClientNetwork();
      setNetwork(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado ao carregar rede de clientes';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRede();
  }, []);

  return (
    <div className="network-layout" aria-busy={loading}>
      <header className="network-header">
        <div>
          <p className="eyebrow">Rede de clientes por tags</p>
          <h1>Visualização de contatos vinculados a tags</h1>
          <p className="muted">Enxergue rapidamente como os contatos se distribuem pelas tags cadastradas, formando a rede de clientes.</p>
        </div>
        <div className="network-actions">
          <a className="btn btn--ghost" href="/">Voltar para o dashboard</a>
          <button type="button" className="btn btn--primary" onClick={carregarRede} disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar dados'}
          </button>
        </div>
      </header>

      {error && (
        <div className="alert alert--error" role="status">
          {error}
        </div>
      )}

      <section className="network-summary" aria-label="Resumo da rede de clientes">
        <div className="summary-card">
          <p className="eyebrow">Contatos analisados</p>
          <h3>{network ? network.totalContatos.toLocaleString('pt-BR') : '-'}</h3>
          <p className="muted">Registros considerados para montar a rede</p>
        </div>
        <div className="summary-card">
          <p className="eyebrow">Tags encontradas</p>
          <h3>{network ? network.totalTags.toLocaleString('pt-BR') : '-'}</h3>
          <p className="muted">Grupos formados a partir das tags atribuídas</p>
        </div>
        <div className="summary-card">
          <p className="eyebrow">Registros processados</p>
          <h3>{network ? network.totalRegistrosProcessados.toLocaleString('pt-BR') : '-'}</h3>
          <p className="muted">Contatos retornados pela API com tags</p>
        </div>
      </section>

      <section className="network-grid" aria-label="Grupos de tags">
        {loading && <p className="muted">Carregando rede de clientes...</p>}
        {!loading && network?.tags.length === 0 && <p className="muted">Nenhuma tag com contatos vinculados foi encontrada.</p>}
        {!loading && network?.tags.map((group) => <GroupCard key={group.tag} group={group} />)}
      </section>
    </div>
  );
}

export default ClientNetworkPage;
