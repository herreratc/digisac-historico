import type { ReactNode } from 'react';

interface InsightCardProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

function InsightCard({ title, subtitle, children }: InsightCardProps) {
  return (
    <div className="insight-card">
      <div className="insight-card__header">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h3 className="insight-card__title">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
}

export default InsightCard;
