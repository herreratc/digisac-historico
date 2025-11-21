import type { MouseEventHandler, ReactNode } from 'react';

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21.21 15.89A10 10 0 1 1 8.1 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19v-6" />
      <path d="M9 19V5" />
      <path d="M14 19v-8" />
      <path d="M19 19V9" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 9h10" />
      <path d="M7 13h6" />
      <path d="M5 19l3-3h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="m19.4 15 1.1 1.9a1 1 0 0 1-.4 1.4l-1.3.8a1 1 0 0 1-1.2-.1l-1.6-1.2a6.7 6.7 0 0 1-1.5.6l-.3 2a1 1 0 0 1-1 .8h-1.6a1 1 0 0 1-1-.8l-.3-2a6.7 6.7 0 0 1-1.5-.6L6.3 19a1 1 0 0 1-1.2.1l-1.3-.8a1 1 0 0 1-.4-1.4L4.6 15a7.6 7.6 0 0 1 0-2L3.4 11a1 1 0 0 1 .4-1.4l1.3-.8a1 1 0 0 1 1.2.1l1.6 1.2a6.7 6.7 0 0 1 1.5-.6l.3-2a1 1 0 0 1 1-.8h1.6a1 1 0 0 1 1 .8l.3 2a6.7 6.7 0 0 1 1.5.6l1.6-1.2a1 1 0 0 1 1.2-.1l1.3.8a1 1 0 0 1 .4 1.4L19.4 13a7.6 7.6 0 0 1 0 2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3h8" />
      <path d="M9 3v6l-2 3v2h10v-2l-2-3V3" />
      <path d="M12 14v7" />
    </svg>
  );
}

function UnpinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3h8" />
      <path d="M9 3v6l-2 3v2h10v-2l-2-3V3" />
      <path d="M12 14v7" />
      <path d="m6 4 12 12" />
    </svg>
  );
}

interface NavItem {
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon /> },
  { label: 'Relatórios', icon: <ReportsIcon /> },
  { label: 'Atendimentos', icon: <ChatIcon /> },
  { label: 'Configurações', icon: <SettingsIcon /> }
];

interface SidebarProps {
  isExpanded: boolean;
  isPinned: boolean;
  onToggle: MouseEventHandler<HTMLButtonElement>;
  onHoverChange: (isHovering: boolean) => void;
}

function Sidebar({ isExpanded, isPinned, onToggle, onHoverChange }: SidebarProps) {
  return (
    <aside
      className={`sidebar ${isExpanded ? 'sidebar--expanded' : 'sidebar--collapsed'} ${isPinned ? 'is-pinned' : ''}`}
      aria-label="Menu principal"
      aria-expanded={isExpanded}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className="brand">
        <div className="brand__icon">GX</div>
        <div className="brand__text">
          <p className="brand__subtitle">CX Operações</p>
          <h1 className="brand__title">Dashboard GX Consultoria</h1>
        </div>
        <button
          className="sidebar__toggle"
          type="button"
          onClick={onToggle}
          aria-label="Fixar ou recolher menu lateral"
          aria-pressed={isPinned}
        >
          {isPinned ? <PinIcon /> : <UnpinIcon />}
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
