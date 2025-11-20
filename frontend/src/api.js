const API_URL = import.meta.env.VITE_API_URL || '';

function buildQuery(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  return query.toString();
}

export async function fetchDashboardStats(params) {
  const queryString = buildQuery(params);
  const url = queryString
    ? `${API_URL}/historico-digisac/tickets/estatisticas?${queryString}`
    : `${API_URL}/historico-digisac/tickets/estatisticas`;

  const response = await fetch(url);

  if (!response.ok) {
    const texto = await response.text();
    throw new Error(`Erro ao buscar estatísticas: ${response.status} - ${texto}`);
  }

  return response.json();
}
