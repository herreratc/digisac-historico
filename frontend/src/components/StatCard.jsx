import PropTypes from 'prop-types';

function StatCard({ label, value, highlight = false }) {
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

export default StatCard;
