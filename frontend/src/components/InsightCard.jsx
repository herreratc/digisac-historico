import PropTypes from 'prop-types';

function InsightCard({ title, subtitle, children }) {
  return (
    <div className="insight-card">
      <div className="insight-card__header">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h3 className="insight-card__title">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
}

InsightCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node
};

export default InsightCard;
