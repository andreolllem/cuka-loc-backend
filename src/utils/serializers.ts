import { Equipment, Rental, User } from "../types";

type EquipmentRow = Equipment;

type RentalRow = Rental & {
  equipamento_nome?: string;
  usuario_nome?: string;
};

type UserLike = Pick<User, "id" | "nome" | "email" | "telefone" | "criado_em">;

function formatDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  return value;
}

function formatDateTime(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

export function serializeEquipment(equipment: EquipmentRow) {
  return {
    id: equipment.id,
    nome: equipment.nome,
    categoria: equipment.categoria,
    descricao: equipment.descricao,
    precoDiaria: Number(equipment.preco_diaria),
    disponibilidade: equipment.disponibilidade,
    imagemUrl: equipment.imagem_url,
    criadoEm: formatDateTime(equipment.criado_em)
  };
}

export function serializeRental(rental: RentalRow) {
  return {
    id: rental.id,
    usuarioId: rental.usuario_id,
    equipamentoId: rental.equipamento_id,
    equipamentoNome: rental.equipamento_nome,
    usuarioNome: rental.usuario_nome,
    dataInicio: formatDate(rental.data_inicio),
    dataFim: formatDate(rental.data_fim),
    status: rental.status,
    valorTotal: Number(rental.valor_total),
    criadoEm: formatDateTime(rental.criado_em)
  };
}

export function serializeUser(user: UserLike) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    criadoEm: formatDateTime(user.criado_em)
  };
}
