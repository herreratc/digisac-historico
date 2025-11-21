import type { MouseEventHandler } from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: '📊' },
  { label: 'Relatórios', icon: '📈' },
  { label: 'Atendimentos', icon: '💬' },
  { label: 'Configurações', icon: '⚙️' }
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: MouseEventHandler<HTMLButtonElement>;
}

function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? '' : 'sidebar--collapsed'}`} aria-label="Menu principal">
      <div className="brand">
        <div className="brand__icon">GX</div>
        <div className="brand__text">
          <p className="brand__subtitle">CX Operações</p>
          <h1 className="brand__title">Dashboard GX Consultoria</h1>
        </div>
        <button className="sidebar__toggle" type="button" onClick={onToggle} aria-label="Alternar menu lateral">
          {isOpen ? '⏴' : '⏵'}
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map((item, index) => (
          <button
            key={item.label}
            className={`sidebar__nav-item ${index === 0 ? 'is-active' : ''}`}
            type="button"
            aria-label={item.label}
          >
            <span className="sidebar__nav-icon" aria-hidden>
              {item.icon}
            </span>
            <span className="sidebar__nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
