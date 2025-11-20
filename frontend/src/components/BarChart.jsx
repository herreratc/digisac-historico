import PropTypes from 'prop-types';

function BarChart({ data, color = '#6366f1' }) {
  const max = Math.max(...data.map((item) => item.value), 0);

  return (
    <div className="bar-chart" role="list" aria-label="Distribuição de tickets por atendente">
      {data.map((item) => {
        const percentual = max ? Math.round((item.value / max) * 100) : 0;
        return (
          <div key={item.label} className="bar-chart__row" role="listitem">
            <div>
              <p className="bar-chart__label">{item.label}</p>
              <p className="bar-chart__value">{item.value.toLocaleString('pt-BR')} tickets</p>
            </div>
            <div className="bar-chart__bar" aria-hidden="true">
              <div className="bar-chart__fill" style={{ width: `${percentual}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ).isRequired,
  color: PropTypes.string
};

export default BarChart;
