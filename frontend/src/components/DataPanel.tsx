import type { ReactNode } from 'react';

export interface PanelItem {
  id: string;
  title: string;
  subtitle?: string;
  value: string;
}

interface DataPanelProps {
  title: string;
  eyebrow: string;
  badge?: string;
  items: PanelItem[];
  loading?: boolean;
  emptyMessage: string;
  footer?: ReactNode;
}

function DataPanel({ title, eyebrow, badge, items, loading, emptyMessage, footer }: DataPanelProps) {
  const hasItems = items.length > 0;

  return (
    <article className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="panel__title">{title}</h3>
        </div>
        {badge && <span className="badge">{badge}</span>}
      </div>

      {loading && <p className="muted">Carregando dados...</p>}

      {!loading && hasItems && (
        <ul className="list">
          {items.map((item) => (
            <li key={item.id} className="list__row">
              <div>
                <p className="list__title">{item.title}</p>
                {item.subtitle && <p className="list__subtitle">{item.subtitle}</p>}
              </div>
              <span className="badge badge--ghost">{item.value}</span>
            </li>
          ))}
        </ul>
      )}

      {!loading && !hasItems && <p className="empty">{emptyMessage}</p>}

      {footer}
    </article>
  );
}

export default DataPanel;
