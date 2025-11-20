import PropTypes from 'prop-types';

function StatCard({ label, value, highlight }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className={`stat-value ${highlight ? 'stat-value--highlight' : ''}`}>{value}</p>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  highlight: PropTypes.bool
};

StatCard.defaultProps = {
  highlight: false
};

export default StatCard;
