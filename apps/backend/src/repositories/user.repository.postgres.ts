import { pgPool } from '../config/postgres.config';
import { User } from '../entities/user';

const TABLE = 'pms.users';

export async function fetchUserData(userId: string): Promise<User | null> {
  const { rows } = await pgPool.query(
    `select id,
            name,
            email,
            status
       from ${TABLE}
      where id = $1`,
    [userId]
  );
  return rows[0] ?? null;
}

export async function updateUserData(userId: string, data: Partial<User>): Promise<void> {
  // Build dynamic update
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  const map: Record<string, string> = {
    name: 'name',
    email: 'email',
    status: 'status',
  } as const;

  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    const col = (map as any)[k];
    if (!col) continue;
    fields.push(`${col} = $${++i}`);
    values.push(v);
  }

  if (fields.length === 0) return;

  const sql = `update ${TABLE} set ${fields.join(', ')}, updated_at = now() where id = $1`;
  await pgPool.query(sql, [userId, ...values]);
}
