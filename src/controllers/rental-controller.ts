import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  listRentalsByUser,
  listRentals,
  createRental,
  cancelRental,
  updateRentalStatus,
  checkAvailability
} from "../services/rental-service";
import { createCheckoutSession } from "../services/payment-service";
import { serializeRental } from "../utils/serializers";

export async function myRentals(req: Request, res: Response) {
  const rentals = await listRentalsByUser(req.user!.sub);
  res.json({ locacoes: rentals.map(serializeRental) });
}

export async function allRentals(_req: Request, res: Response) {
  const rentals = await listRentals();
  res.json({ locacoes: rentals.map(serializeRental) });
}

export async function verifyAvailability(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  const disponibilidade = await checkAvailability(req.body);
  res.json(disponibilidade);
}

export async function storeRental(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  try {
    const rental = await createRental({
      usuarioId: req.user!.sub,
      equipamentoId: req.body.equipamentoId,
      dataInicio: req.body.dataInicio,
      dataFim: req.body.dataFim
    });

    const checkout = await createCheckoutSession({
      rentalId: rental.id,
      amount: Number(rental.valor_total),
      successUrl: `${req.body.successUrl ?? "http://localhost:3000"}/locacoes/sucesso`,
      cancelUrl: `${req.body.cancelUrl ?? "http://localhost:3000"}/locacoes/nova`
    });

    res.status(201).json({ locacao: serializeRental(rental), checkout });
  } catch (error: any) {
    res.status(400).json({ mensagem: error.message });
  }
}

export async function cancel(req: Request, res: Response) {
  const rental = await cancelRental(Number(req.params.id), req.user?.sub);
  if (!rental) {
    return res.status(404).json({ mensagem: "Locação não encontrada" });
  }
  res.json({ locacao: serializeRental(rental) });
}

export async function updateStatus(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  const rental = await updateRentalStatus(Number(req.params.id), req.body.status);
  res.json({ locacao: serializeRental(rental) });
}
