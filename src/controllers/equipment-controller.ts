import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  listEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from "../services/equipment-service";
import { serializeEquipment } from "../utils/serializers";

export async function index(_req: Request, res: Response) {
  const equipamentos = await listEquipments();
  res.json({ equipamentos: equipamentos.map(serializeEquipment) });
}

export async function show(req: Request, res: Response) {
  const equipamento = await getEquipmentById(Number(req.params.id));
  if (!equipamento) {
    return res.status(404).json({ mensagem: "Equipamento não encontrado" });
  }
  res.json({ equipamento: serializeEquipment(equipamento) });
}

export async function store(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  const equipamento = await createEquipment(req.body);
  res.status(201).json({ equipamento: serializeEquipment(equipamento) });
}

export async function update(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  try {
    const equipamento = await updateEquipment(Number(req.params.id), req.body);
    res.json({ equipamento: serializeEquipment(equipamento) });
  } catch (error: any) {
    res.status(404).json({ mensagem: error.message });
  }
}

export async function destroy(req: Request, res: Response) {
  await deleteEquipment(Number(req.params.id));
  res.status(204).send();
}
