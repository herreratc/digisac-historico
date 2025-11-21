export type StatusFilter = '' | 'open' | 'closed';

export interface FilterState {
  dataInicio: string;
  dataFim: string;
  status: StatusFilter;
}

export interface TicketResumo {
  totalChamados?: number;
  totalTickets?: number;
  totalAbertos: number;
  totalFechados: number;
}

export interface QuantidadePorAtendente {
  nome: string;
  quantidade: number;
}

export interface RankingItem extends QuantidadePorAtendente {
  canal?: string;
  ultimoAtendimento?: string;
  [key: string]: string | number | undefined;
}

export interface DashboardStats {
  resumo: TicketResumo;
  quantidadePorAtendente: QuantidadePorAtendente[];
  topClientes: RankingItem[];
  atendentesComMaisAtendimentos: RankingItem[];
}
