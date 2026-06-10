import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { created_at: 'desc' },
      include: { qa_lists: true }
    });
    return res.json({ jobs });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const updateJobStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // If transitioning to DIE_CUT, maybe require QA check first (simplified logic here)
    const job = await prisma.job.update({
      where: { id },
      data: { status }
    });
    return res.json({ job });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update job status' });
  }
};

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: 'asc' }
    });
    return res.json({ materials });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch materials' });
  }
};

export const logMaterialUsage = async (req: AuthRequest, res: Response) => {
  const { material_id, job_id, amount_used } = req.body;
  const user_id = req.user?.id;

  if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Transaction to log usage and deduct from stock
    const result = await prisma.$transaction(async (tx) => {
      const usage = await tx.materialUsage.create({
        data: { material_id, job_id, user_id, amount_used }
      });
      
      const updatedMaterial = await tx.material.update({
        where: { id: material_id },
        data: { stock_level: { decrement: amount_used } }
      });

      return { usage, updatedMaterial };
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to log material usage' });
  }
};

export const submitQAChecklist = async (req: AuthRequest, res: Response) => {
  const { job_id, stage, passed, notes } = req.body;
  const user_id = req.user?.id;

  if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const qa = await prisma.qAChecklist.create({
      data: { job_id, user_id, stage, passed, notes }
    });
    return res.json({ qa });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to submit QA checklist' });
  }
};
