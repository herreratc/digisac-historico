import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        {subtitle && <p className="eyebrow">{subtitle}</p>}
        <h2 className="page-title">{title}</h2>
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

export default PageHeader;
