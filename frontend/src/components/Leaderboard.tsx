import type { RankingItem } from '../types';

interface LeaderboardProps {
  title: string;
  items?: RankingItem[];
  descriptionKeys?: string[];
}

function Leaderboard({ title, items = [], descriptionKeys = [] }: LeaderboardProps) {
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

export default Leaderboard;
