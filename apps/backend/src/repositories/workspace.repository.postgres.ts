import { pgPool } from '../config/postgres.config';
import { Workspace } from '../entities/workspace';

function toStatusNumber(value: any): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  const n = parseInt(String(value), 10);
  return Number.isNaN(n) ? null : n;
}

function mapRow(r: any): Workspace {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? null,
    status: toStatusNumber(r.status),
    createdBy: r.created_by,
    createdAt: r.created_at?.toISOString?.() ?? r.created_at,
    updatedAt: r.updated_at?.toISOString?.() ?? r.updated_at,
  };
}

export async function listWorkspacesForUser(userId: string): Promise<Workspace[]> {
  const { rows } = await pgPool.query(
    `select w.*
       from workspaces w
       join workspace_members m on m.workspace_id = w.id
      where m.user_id = $1
      order by w.created_at desc`,
    [userId]
  );
  return rows.map(mapRow);
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const { rows } = await pgPool.query(`select * from workspaces where id = $1`, [id]);
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function createWorkspace(userId: string, data: { name: string; description?: string | null; status?: number | null }): Promise<Workspace> {
  const client = await pgPool.connect();
  try {
    await client.query('begin');
    const { rows } = await client.query(
      `insert into workspaces (name, description, status, created_by)
       values ($1, $2, $3, $4)
       returning *`,
      [data.name, data.description ?? null, data.status === undefined || data.status === null ? null : String(data.status), userId]
    );
    const ws = mapRow(rows[0]);
    // Add creator as OWNER member
    await client.query(
      `insert into workspace_members (workspace_id, user_id, role) values ($1, $2, 'OWNER') on conflict do nothing`,
      [ws.id, userId]
    );
    await client.query('commit');
    return ws;
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
}

export async function updateWorkspace(id: string, data: { name?: string; description?: string | null; status?: number | null }): Promise<Workspace | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;
  if (data.name !== undefined) {
    fields.push(`name = $${i++}`);
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push(`description = $${i++}`);
    values.push(data.description);
  }
  if (data.status !== undefined) {
    fields.push(`status = $${i++}`);
    values.push(data.status === null ? null : String(data.status));
  }
  if (fields.length === 0) return getWorkspaceById(id);
  values.push(id);
  const { rows } = await pgPool.query(
    `update workspaces set ${fields.join(', ')}, updated_at = now() where id = $${i} returning *`,
    values
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function listByIds(ids: string[]): Promise<Workspace[]> {
  if (!ids?.length) return [];
  const { rows } = await pgPool.query(`select * from workspaces where id = any($1)`, [ids]);
  return rows.map(mapRow);
}

export async function getMemberRole(workspaceId: string, userId: string): Promise<'OWNER'|'ADMIN'|'MEMBER'|'GUEST'|null> {
  const { rows } = await pgPool.query(
    `select role from workspace_members where workspace_id = $1 and user_id = $2`,
    [workspaceId, userId]
  );
  return rows[0]?.role ?? null;
}

export async function addMember(workspaceId: string, userId: string, role: 'ADMIN'|'MEMBER'|'GUEST' = 'MEMBER'): Promise<void> {
  await pgPool.query(
    `insert into workspace_members (workspace_id, user_id, role) values ($1,$2,$3)
     on conflict (workspace_id, user_id) do update set role = excluded.role`,
    [workspaceId, userId, role]
  );
}

export async function removeMember(workspaceId: string, userId: string): Promise<void> {
  await pgPool.query(`delete from workspace_members where workspace_id = $1 and user_id = $2`, [workspaceId, userId]);
}
