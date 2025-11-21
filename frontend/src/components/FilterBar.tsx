import type { ChangeEvent } from 'react';
import { formatDateISO } from '../utils/formatters';
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

  const applyPreset = (days: number) => {
    const end = new Date();
    end.setDate(end.getDate() - 1);

    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    onChange({
      ...filters,
      dataInicio: formatDateISO(start),
      dataFim: formatDateISO(end)
    });
  };

  return (
    <div className="filter-bar" role="form" aria-label="Filtros do dashboard">
      <div className="filter-presets" aria-label="Períodos rápidos">
        <p className="filter-label">Períodos rápidos</p>
        <div className="filter-presets__actions">
          <button className="btn btn--ghost" type="button" onClick={() => applyPreset(1)} disabled={loading}>
            Ontem
          </button>
          <button className="btn btn--ghost" type="button" onClick={() => applyPreset(7)} disabled={loading}>
            Últimos 7 dias
          </button>
          <button className="btn btn--ghost" type="button" onClick={() => applyPreset(30)} disabled={loading}>
            Últimos 30 dias
          </button>
        </div>
      </div>

      <div className="filter-field">
        <label className="filter-label" htmlFor="dataInicio">
          Data início
        </label>
        <input
          id="dataInicio"
          name="dataInicio"
          className="filter-input"
          type="date"
          value={filters.dataInicio}
          onChange={handleInput}
          placeholder="Selecione a data inicial"
        />
      </div>
      <div className="filter-field">
        <label className="filter-label" htmlFor="dataFim">
          Data fim
        </label>
        <input
          id="dataFim"
          name="dataFim"
          className="filter-input"
          type="date"
          value={filters.dataFim}
          onChange={handleInput}
          placeholder="Selecione a data final"
        />
      </div>
      <div className="filter-field">
        <label className="filter-label" htmlFor="status">
          Status
        </label>
        <select id="status" name="status" className="filter-select" value={filters.status} onChange={handleInput}>
          <option value="">Todos</option>
          <option value="open">Abertos</option>
          <option value="closed">Fechados</option>
        </select>
      </div>
      <div className="filter-actions">
        <button className="btn btn--ghost" onClick={onReset} disabled={loading} type="button">
          Limpar
        </button>
        <button className="btn btn--primary" onClick={onSubmit} disabled={loading} type="button">
          {loading ? 'Atualizando...' : 'Aplicar filtros'}
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
