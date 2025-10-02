export type User = {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  telefone: string;
  criado_em: Date;
};

export type Equipment = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  preco_diaria: number;
  disponibilidade: boolean;
  imagem_url: string;
  criado_em: Date;
};

export type RentalStatus = "pendente" | "confirmada" | "concluida" | "cancelada";

export type Rental = {
  id: number;
  usuario_id: number;
  equipamento_id: number;
  data_inicio: Date;
  data_fim: Date;
  status: RentalStatus;
  valor_total: number;
  criado_em: Date;
};

export type JwtPayload = {
  sub: number;
  email: string;
  [key: string]: unknown;
};
