export function formatNumber(value: number | string | undefined | null): string {
  if (value === null || value === undefined) return '--';
  return typeof value === 'number' ? value.toLocaleString('pt-BR') : value;
}

export const formatDateISO = (date: Date) => date.toISOString().slice(0, 10);
