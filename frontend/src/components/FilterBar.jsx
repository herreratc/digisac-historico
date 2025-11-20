import PropTypes from 'prop-types';

function FilterBar({ filters, onChange, onSubmit, loading }) {
  const handleInput = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-field">
        <label htmlFor="dataInicio">Data início</label>
        <input
          id="dataInicio"
          name="dataInicio"
          type="datetime-local"
          value={filters.dataInicio}
          onChange={handleInput}
        />
      </div>
      <div className="filter-field">
        <label htmlFor="dataFim">Data fim</label>
        <input id="dataFim" name="dataFim" type="datetime-local" value={filters.dataFim} onChange={handleInput} />
      </div>
      <div className="filter-field">
        <label htmlFor="serviceId">ID do serviço</label>
        <input
          id="serviceId"
          name="serviceId"
          placeholder="Opcional"
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
      <button className="primary-btn" onClick={onSubmit} disabled={loading}>
        {loading ? 'Atualizando...' : 'Aplicar filtros'}
      </button>
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

FilterBar.defaultProps = {
  loading: false
};

export default FilterBar;
