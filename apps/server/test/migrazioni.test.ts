import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { afterAll, describe, expect, it } from 'vitest';
import { applicaMigrazioni, elencoMigrazioni } from '../src/migrazioni.js';

const cartellaVera = join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('elenco delle migrazioni', () => {
  it('le migrazioni del progetto hanno nomi validi e numeri unici', async () => {
    const file = await elencoMigrazioni(cartellaVera);
    expect(file[0]).toBe('0001_avvio.sql');
  });

  it('rifiuta nomi non validi', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'oc-migr-'));
    await writeFile(join(dir, 'tabelle.sql'), 'select 1');
    await expect(elencoMigrazioni(dir)).rejects.toThrow(/non valido/);
  });

  it('rifiuta numeri ripetuti', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'oc-migr-'));
    await writeFile(join(dir, '0001_a.sql'), 'select 1');
    await writeFile(join(dir, '0001_b.sql'), 'select 1');
    await expect(elencoMigrazioni(dir)).rejects.toThrow(/ripetuto/);
  });
});

// Prove con un database vero: girano in CI (e ovunque sia impostata DATABASE_URL_TEST).
const url = process.env.DATABASE_URL_TEST;
describe.skipIf(!url)('migrazioni su PostgreSQL', () => {
  const pool = new pg.Pool({ connectionString: url });
  afterAll(() => pool.end());

  it('applica le migrazioni una volta sola', async () => {
    await pool.query('drop table if exists migrazioni');
    expect(await applicaMigrazioni(pool, cartellaVera)).toContain('0001_avvio.sql');
    expect(await applicaMigrazioni(pool, cartellaVera)).toEqual([]);
  });

  it('una migrazione sbagliata non lascia nulla a metà', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'oc-migr-'));
    await writeFile(
      join(dir, '9001_rotta.sql'),
      'create table prova_rotta (id int); select * from non_esiste;',
    );
    await expect(applicaMigrazioni(pool, dir)).rejects.toThrow(/9001_rotta\.sql fallita/);
    const r = await pool.query("select to_regclass('prova_rotta') as t");
    expect(r.rows[0].t).toBeNull();
  });
});
