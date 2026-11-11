import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type pg from 'pg';

/**
 * Migrazioni versionate del database.
 * Ogni file `NNNN_descrizione.sql` nella cartella migrations viene applicato
 * una volta sola, in ordine, dentro una transazione. Un file già applicato non
 * si modifica mai: per cambiare qualcosa si aggiunge un file nuovo.
 */
const NOME_VALIDO = /^\d{4}_[a-z0-9_]+\.sql$/;

export async function elencoMigrazioni(cartella: string): Promise<string[]> {
  const file = (await readdir(cartella)).filter((f) => f.endsWith('.sql')).sort();
  for (const f of file) {
    if (!NOME_VALIDO.test(f)) {
      throw new Error(`Nome di migrazione non valido: ${f} (atteso NNNN_descrizione.sql)`);
    }
  }
  const numeri = file.map((f) => f.slice(0, 4));
  const doppi = numeri.filter((n, i) => numeri.indexOf(n) !== i);
  if (doppi.length > 0) {
    throw new Error(`Numero di migrazione ripetuto: ${[...new Set(doppi)].join(', ')}`);
  }
  return file;
}

export async function applicaMigrazioni(pool: pg.Pool, cartella: string): Promise<string[]> {
  const file = await elencoMigrazioni(cartella);
  const client = await pool.connect();
  const applicate: string[] = [];
  try {
    // un solo processo alla volta può migrare
    await client.query('select pg_advisory_lock(727001)');
    await client.query(`
      create table if not exists migrazioni (
        nome text primary key,
        applicata_il timestamptz not null default now()
      )`);
    const fatte = new Set(
      (await client.query<{ nome: string }>('select nome from migrazioni')).rows.map((r) => r.nome),
    );
    for (const nome of file) {
      if (fatte.has(nome)) continue;
      const sql = await readFile(join(cartella, nome), 'utf8');
      try {
        await client.query('begin');
        await client.query(sql);
        await client.query('insert into migrazioni (nome) values ($1)', [nome]);
        await client.query('commit');
      } catch (errore) {
        await client.query('rollback');
        throw new Error(`Migrazione ${nome} fallita: ${(errore as Error).message}`, {
          cause: errore,
        });
      }
      applicate.push(nome);
    }
  } finally {
    await client.query('select pg_advisory_unlock(727001)').catch(() => undefined);
    client.release();
  }
  return applicate;
}
