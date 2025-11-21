import type { ReactNode } from 'react';

export type MetricTone = 'primary' | 'success' | 'warning' | 'neutral';

interface MetricCardProps {
  label: string;
  value: string;
  helper?: string;
  tone?: MetricTone;
  icon?: ReactNode;
}

function MetricCard({ label, value, helper, tone = 'neutral', icon }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__content">
        <p className="metric-card__label">{label}</p>
        <h3 className="metric-card__value">{value}</h3>
        {helper && <span className="metric-card__helper">{helper}</span>}
      </div>
      {icon && <div className="metric-card__icon">{icon}</div>}
    </article>
  );
}

export default MetricCard;
