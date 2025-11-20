import PropTypes from 'prop-types';

function DonutChart({ abertos, fechados, porcentagemAbertos, porcentagemFechados }) {
  const total = abertos + fechados;
  const abertoPercentual = total ? (abertos / total) * 100 : 0;
  const gradient = `conic-gradient(#22c55e 0% ${abertoPercentual}%, #6366f1 ${abertoPercentual}% 100%)`;

  return (
    <div className="donut" style={{ background: gradient }} aria-label="Distribuição de chamados abertos e fechados">
      <div className="donut__center">
        <p className="donut__value">{total.toLocaleString('pt-BR')}</p>
        <p className="donut__label">chamados</p>
      </div>
      <div className="donut__legend" aria-hidden="true">
        <span className="dot dot--green" />
        {porcentagemAbertos}% abertos
        <span className="dot dot--purple" />
        {porcentagemFechados}% fechados
      </div>
    </div>
  );
}

DonutChart.propTypes = {
  abertos: PropTypes.number.isRequired,
  fechados: PropTypes.number.isRequired,
  porcentagemAbertos: PropTypes.number.isRequired,
  porcentagemFechados: PropTypes.number.isRequired
};

export default DonutChart;
