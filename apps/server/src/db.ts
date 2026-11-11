import pg from 'pg';

export type Database = {
  /** true se il database risponde */
  risponde(): Promise<boolean>;
  chiudi(): Promise<void>;
  pool: pg.Pool;
};

export function apriDatabase(databaseUrl: string): Database {
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 10 });
  return {
    pool,
    async risponde() {
      try {
        await pool.query('select 1');
        return true;
      } catch {
        return false;
      }
    },
    async chiudi() {
      await pool.end();
    },
  };
}
