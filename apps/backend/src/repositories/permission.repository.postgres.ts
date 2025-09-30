import { pgPool } from '../config/postgres.config';

export async function getEffectiveRole(userId: string): Promise<'ADMIN'|'OWNER'|'MEMBER'> {
  // Admin if the user is ADMIN in any workspace
  const admin = await pgPool.query<{ exists: boolean }>(
    `select exists(select 1 from pms.workspace_members where user_id = $1 and role = 'ADMIN') as exists`,
    [userId]
  );
  if (admin.rows?.[0]?.exists) return 'ADMIN';

  // Owner if the user has created any project
  const owner = await pgPool.query<{ exists: boolean }>(
    `select exists(select 1 from pms.projects where created_by = $1) as exists`,
    [userId]
  );
  if (owner.rows?.[0]?.exists) return 'OWNER';

  return 'MEMBER';
}

export async function getPermissionsForRole(role: 'ADMIN'|'OWNER'|'MEMBER'): Promise<string[]> {
  const { rows } = await pgPool.query<{ permission: string }>(
    `select permission from pms.role_permissions where role = $1 order by permission`,
    [role]
  );
  return rows.map(r => r.permission);
}
