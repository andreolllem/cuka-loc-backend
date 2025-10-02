import { query, transaction } from "../config/db";
import type { PoolClient } from "pg";
import { Equipment, Rental, RentalStatus } from "../types";

type RentalWithNames = Rental & {
  equipamento_nome: string;
  usuario_nome?: string;
};

function calculateDays(dataInicio: string, dataFim: string) {
  const start = new Date(dataInicio);
  const end = new Date(dataFim);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);
}

async function fetchEquipment(client: PoolClient, equipamentoId: number) {
  const result = await client.query<Equipment>(`SELECT * FROM equipamentos WHERE id = $1`, [equipamentoId]);
  return result.rows[0];
}

export async function listRentalsByUser(userId: number) {
  return query<RentalWithNames>(
    `SELECT l.id,
            l.usuario_id,
            l.equipamento_id,
            l.data_inicio,
            l.data_fim,
            l.status,
            l.valor_total,
            l.criado_em,
            e.nome as equipamento_nome
       FROM locacoes l
       JOIN equipamentos e ON e.id = l.equipamento_id
      WHERE l.usuario_id = $1
      ORDER BY l.data_inicio DESC`,
    [userId]
  );
}

export async function listRentals() {
  return query<RentalWithNames>(
    `SELECT l.id,
            l.usuario_id,
            l.equipamento_id,
            l.data_inicio,
            l.data_fim,
            l.status,
            l.valor_total,
            l.criado_em,
            e.nome as equipamento_nome,
            u.nome as usuario_nome
       FROM locacoes l
       JOIN equipamentos e ON e.id = l.equipamento_id
       JOIN usuarios u ON u.id = l.usuario_id
      ORDER BY l.data_inicio DESC`
  );
}

export async function checkAvailability({
  equipamentoId,
  dataInicio,
  dataFim
}: {
  equipamentoId: number;
  dataInicio: string;
  dataFim: string;
}) {
  const conflito = await query<{ conflito: boolean }>(
    `SELECT EXISTS (
        SELECT 1 FROM locacoes
         WHERE equipamento_id = $1
           AND status <> 'cancelada'
           AND daterange(data_inicio, data_fim, '[]') && daterange($2::date, $3::date, '[]')
      ) as conflito`,
    [equipamentoId, dataInicio, dataFim]
  );

  const equipamentoRows = await query<Equipment>(`SELECT * FROM equipamentos WHERE id = $1`, [equipamentoId]);
  const equipamento = equipamentoRows[0];

  let valorEstimado: number | undefined;
  if (equipamento) {
    valorEstimado = Number(equipamento.preco_diaria) * calculateDays(dataInicio, dataFim);
  }

  return { disponivel: !conflito[0]?.conflito, valorEstimado };
}

export async function createRental({
  usuarioId,
  equipamentoId,
  dataInicio,
  dataFim
}: {
  usuarioId: number;
  equipamentoId: number;
  dataInicio: string;
  dataFim: string;
}) {
  return transaction(async (client) => {
    const disponibilidade = await checkAvailability({ equipamentoId, dataInicio, dataFim });
    if (!disponibilidade.disponivel) {
      throw new Error("Equipamento indisponível nas datas selecionadas");
    }

    const equipamento = await fetchEquipment(client, equipamentoId);
    if (!equipamento) {
      throw new Error("Equipamento não encontrado");
    }

    const valorTotal = Number(equipamento.preco_diaria) * calculateDays(dataInicio, dataFim);

    const insert = await client.query<Rental>(
      `INSERT INTO locacoes (usuario_id, equipamento_id, data_inicio, data_fim, status, valor_total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [usuarioId, equipamentoId, dataInicio, dataFim, "pendente", valorTotal]
    );

    await client.query("UPDATE equipamentos SET disponibilidade = false WHERE id = $1", [equipamentoId]);

    return insert.rows[0];
  });
}

export async function updateRentalStatus(id: number, status: RentalStatus) {
  const rows = await query<Rental>(
    `UPDATE locacoes SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );

  if (status === "concluida" || status === "cancelada") {
    const rental = rows[0];
    if (rental) {
      await query("UPDATE equipamentos SET disponibilidade = true WHERE id = $1", [rental.equipamento_id]);
    }
  }

  return rows[0];
}

export async function cancelRental(id: number, userId?: number) {
  const rows = await query<Rental>(
    `UPDATE locacoes
        SET status = 'cancelada'
      WHERE id = $1
        AND ($2::int IS NULL OR usuario_id = $2)
      RETURNING *`,
    [id, userId ?? null]
  );

  const rental = rows[0];
  if (rental) {
    await query("UPDATE equipamentos SET disponibilidade = true WHERE id = $1", [rental.equipamento_id]);
  }

  return rental;
}
