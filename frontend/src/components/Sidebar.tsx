const NAV_ITEMS = [
  { label: 'Dashboard', code: '01' },
  { label: 'Relatórios', code: '02' },
  { label: 'Atendimentos', code: '03' },
  { label: 'Configurações', code: '04' }
];

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menu principal">
      <div className="brand">
        <div className="brand__icon">GX</div>
        <div>
          <p className="brand__subtitle">CX Operações</p>
          <h1 className="brand__title">Dashboard GX Consultoria</h1>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map((item, index) => (
          <button
            key={item.label}
            className={`sidebar__nav-item ${index === 0 ? 'is-active' : ''}`}
            type="button"
          >
            <span className="sidebar__nav-icon">{item.code}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__note">
        <strong>Profissional Tecnológico</strong>
        <p>Menu lateral estático reforça a navegação e deixa o foco na análise.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
