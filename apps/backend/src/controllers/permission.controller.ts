import { Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as permRepo from '../repositories/permission.repository.postgres';

export const mePermissions = [authMiddleware, async function mePermissions(req: any, res: Response) {
  try {
    const role = await permRepo.getEffectiveRole(req.userId);
    const permissions = await permRepo.getPermissionsForRole(role);
    res.json({ role, permissions });
  } catch (e: any) {
    res.status(500).json({ message: 'Failed to load permissions', error: String(e?.message || e) });
  }
}];
