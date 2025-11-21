import type { ChangeEvent } from 'react';
import type { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (nextFilters: FilterState) => void;
  onSubmit: () => void;
  onReset: () => void;
  loading?: boolean;
}

function FilterBar({ filters, onChange, onSubmit, onReset, loading = false }: FilterBarProps) {
  const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          name="tags"
          placeholder="Ex.: suporte, vip"
          value={filters.tags}
          onChange={handleInput}
        />
      </div>
      <div className="filter-field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={filters.status} onChange={handleInput}>
          <option value="">Todos</option>
          <option value="open">Abertos</option>
          <option value="closed">Fechados</option>
        </select>
      </div>
      <div className="filter-actions">
        <button className="secondary-btn" onClick={onReset} disabled={loading}>
          Limpar
        </button>
        <button className="primary-btn" onClick={onSubmit} disabled={loading}>
          {loading ? 'Atualizando...' : 'Aplicar filtros'}
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
