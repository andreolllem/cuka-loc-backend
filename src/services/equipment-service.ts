import { query } from "@/config/db";
import { Equipment } from "@/types";

export async function listEquipments() {
  return query<Equipment>(
    `SELECT id, nome, categoria, descricao, preco_diaria, disponibilidade, imagem_url, criado_em
     FROM equipamentos
     ORDER BY criado_em DESC`
  );
}

export async function getEquipmentById(id: number) {
  const rows = await query<Equipment>(
    `SELECT id, nome, categoria, descricao, preco_diaria, disponibilidade, imagem_url, criado_em
     FROM equipamentos WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createEquipment(data: {
  nome: string;
  categoria: string;
  descricao: string;
  preco_diaria: number;
  disponibilidade: boolean;
  imagem_url: string;
}) {
  const rows = await query<Equipment>(
    `INSERT INTO equipamentos (nome, categoria, descricao, preco_diaria, disponibilidade, imagem_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nome, categoria, descricao, preco_diaria, disponibilidade, imagem_url, criado_em`,
    [
      data.nome,
      data.categoria,
      data.descricao,
      data.preco_diaria,
      data.disponibilidade,
      data.imagem_url
    ]
  );

  return rows[0];
}

export async function updateEquipment(id: number, data: Partial<Omit<Equipment, "id" | "criado_em">>) {
  const current = await getEquipmentById(id);
  if (!current) {
    throw new Error("Equipamento não encontrado");
  }

  const payload = {
    nome: data.nome ?? current.nome,
    categoria: data.categoria ?? current.categoria,
    descricao: data.descricao ?? current.descricao,
    preco_diaria: data.preco_diaria ?? current.preco_diaria,
    disponibilidade: data.disponibilidade ?? current.disponibilidade,
    imagem_url: data.imagem_url ?? current.imagem_url
  };

  const rows = await query<Equipment>(
    `UPDATE equipamentos SET
        nome = $1,
        categoria = $2,
        descricao = $3,
        preco_diaria = $4,
        disponibilidade = $5,
        imagem_url = $6
     WHERE id = $7
     RETURNING id, nome, categoria, descricao, preco_diaria, disponibilidade, imagem_url, criado_em`,
    [
      payload.nome,
      payload.categoria,
      payload.descricao,
      payload.preco_diaria,
      payload.disponibilidade,
      payload.imagem_url,
      id
    ]
  );

  return rows[0];
}

export async function deleteEquipment(id: number) {
  await query("DELETE FROM equipamentos WHERE id = $1", [id]);
}
