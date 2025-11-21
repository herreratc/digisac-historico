interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  highlight?: boolean;
}

function StatCard({ label, value, caption, highlight = false }: StatCardProps) {
  return (
    <div className={`stat-card ${highlight ? 'stat-card--highlight' : ''}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {caption && <p className="stat-caption">{caption}</p>}
    </div>
  );
}

export default StatCard;
