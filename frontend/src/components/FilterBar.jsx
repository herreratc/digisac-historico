import PropTypes from 'prop-types';

function FilterBar({ filters, onChange, onSubmit, loading = false }) {
  const handleInput = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar" role="form" aria-label="Filtros do dashboard">
      <div className="filter-field">
        <label htmlFor="dataInicio">Data início</label>
        <input
          id="dataInicio"
          name="dataInicio"
          type="datetime-local"
          value={filters.dataInicio}
          onChange={handleInput}
          placeholder="Selecione a data inicial"
        />
      </div>
      <div className="filter-field">
        <label htmlFor="dataFim">Data fim</label>
        <input
          id="dataFim"
          name="dataFim"
          type="datetime-local"
          value={filters.dataFim}
          onChange={handleInput}
          placeholder="Selecione a data final"
        />
      </div>
      <div className="filter-field">
        <label htmlFor="serviceId">ID do serviço</label>
        <input
          id="serviceId"
          name="serviceId"
          placeholder="Ex.: 123, voice, suporte"
          value={filters.serviceId}
          onChange={handleInput}
        />
      </div>
      <div className="filter-field">
        <label htmlFor="isOpen">Status</label>
        <select id="isOpen" name="isOpen" value={filters.isOpen} onChange={handleInput}>
          <option value="">Abertos e fechados</option>
          <option value="true">Somente abertos</option>
          <option value="false">Somente fechados</option>
        </select>
      </div>
      <div className="filter-actions">
        <button className="secondary-btn" onClick={() => onChange({ dataInicio: '', dataFim: '', serviceId: '', isOpen: '' })} disabled={loading}>
          Limpar
        </button>
        <button className="primary-btn" onClick={onSubmit} disabled={loading}>
          {loading ? 'Atualizando...' : 'Aplicar filtros'}
        </button>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  filters: PropTypes.shape({
    dataInicio: PropTypes.string,
    dataFim: PropTypes.string,
    serviceId: PropTypes.string,
    isOpen: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default FilterBar;
