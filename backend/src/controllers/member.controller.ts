import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth.middleware';

// ─── CLIENTS ───────────────────────────────────────────────

export const getClients = async (req: AuthRequest, res: Response) => {
  const memberId = req.user?.id;
  const { search, temperature } = req.query;

  try {
    const where: any = {};
    if (memberId) where.assigned_to = memberId;
    if (temperature) where.temperature = temperature;
    if (search) {
      where.OR = [
        { company_name: { contains: search as string, mode: 'insensitive' } },
        { contact_name: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { updated_at: 'desc' },
    });
    return res.json({ clients });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: { quotes: { orderBy: { created_at: 'desc' }, take: 10 }, deals: true },
    });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    return res.json({ client });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch client' });
  }
};

export const createClient = async (req: AuthRequest, res: Response) => {
  const memberId = req.user?.id;
  const { company_name, contact_name, email, phone, industry } = req.body;

  try {
    const client = await prisma.client.create({
      data: { company_name, contact_name, email, phone, industry, assigned_to: memberId },
    });
    return res.status(201).json({ client });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create client' });
  }
};

// ─── QUOTES ────────────────────────────────────────────────

export const getQuotes = async (req: AuthRequest, res: Response) => {
  const memberId = req.user?.id;
  try {
    const quotes = await prisma.quote.findMany({
      where: { member_id: memberId },
      include: { client: true, lines: true },
      orderBy: { updated_at: 'desc' },
    });
    return res.json({ quotes });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch quotes' });
  }
};

export const createQuote = async (req: AuthRequest, res: Response) => {
  const memberId = req.user?.id;
  if (!memberId) return res.status(401).json({ error: 'Unauthorized' });

  const { client_id, lines, is_rush, notes, expires_at } = req.body;

  try {
    // Calculate totals from lines
    let subtotal = 0;
    let discountTotal = 0;
    const processedLines = (lines || []).map((line: any) => {
      const lineTotal = line.quantity * line.unit_price * (1 - (line.discount_pct || 0) / 100);
      const lineDiscount = line.quantity * line.unit_price * ((line.discount_pct || 0) / 100);
      subtotal += line.quantity * line.unit_price;
      discountTotal += lineDiscount;
      return { ...line, line_total: lineTotal };
    });

    const grandTotal = subtotal - discountTotal;
    // Rough margin calc: assume 30% base cost
    const marginPct = subtotal > 0 ? ((grandTotal - subtotal * 0.3) / grandTotal) * 100 : 0;

    const quote = await prisma.quote.create({
      data: {
        client_id,
        member_id: memberId,
        subtotal,
        discount_total: discountTotal,
        grand_total: grandTotal,
        margin_pct: Math.round(marginPct * 100) / 100,
        is_rush: is_rush || false,
        notes,
        expires_at: expires_at ? new Date(expires_at) : null,
        lines: { create: processedLines },
      },
      include: { lines: true },
    });

    return res.status(201).json({ quote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create quote' });
  }
};

export const updateQuote = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const quote = await prisma.quote.update({
      where: { id },
      data: { status, notes },
    });
    return res.json({ quote });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update quote' });
  }
};

// ─── DEALS / PIPELINE ──────────────────────────────────────

export const getDeals = async (req: AuthRequest, res: Response) => {
  const memberId = req.user?.id;
  try {
    const deals = await prisma.deal.findMany({
      where: { member_id: memberId },
      include: { client: true },
      orderBy: { updated_at: 'desc' },
    });
    return res.json({ deals });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch deals' });
  }
};

export const updateDealStage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage, lost_reason } = req.body;

  try {
    const deal = await prisma.deal.update({
      where: { id },
      data: { stage, lost_reason },
    });
    return res.json({ deal });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update deal stage' });
  }
};
