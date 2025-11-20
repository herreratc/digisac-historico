import PropTypes from 'prop-types';

function Leaderboard({ title, items = [], descriptionKeys = [] }) {
  return (
    <div className="panel">
      <div className="panel__header">
        <h3>{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="empty">Nenhum dado encontrado para os filtros selecionados.</p>
      ) : (
        <ul className="leaderboard">
          {items.map((item, index) => (
            <li key={`${item.nome}-${index}`} className="leaderboard__item">
              <div>
                <p className="leaderboard__position">#{index + 1}</p>
                <p className="leaderboard__name">{item.nome}</p>
                {descriptionKeys.map((key) => (
                  <p key={key} className="leaderboard__description">
                    {item[key] || '—'}
                  </p>
                ))}
              </div>
              <span className="leaderboard__badge">{item.quantidade}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

Leaderboard.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      nome: PropTypes.string.isRequired,
      quantidade: PropTypes.number.isRequired
    })
  ),
  descriptionKeys: PropTypes.arrayOf(PropTypes.string)
};

export default Leaderboard;
