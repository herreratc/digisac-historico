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

export interface ContactPreview {
  id: string | number;
  nome: string;
  canal?: string;
}

export interface ClientTagGroup {
  tag: string;
  quantidade: number;
  exemplos: ContactPreview[];
  canais: string[];
}

export interface ClientNetwork {
  filtros: { perPage?: number; maxExemplos?: number };
  totalRegistrosProcessados: number;
  totalContatos: number;
  totalTags: number;
  tags: ClientTagGroup[];
}
