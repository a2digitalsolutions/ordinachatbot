import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leggiConfig } from './config.js';
import { apriDatabase } from './db.js';
import { applicaMigrazioni } from './migrazioni.js';

const config = leggiConfig();
if (!config.databaseUrl) {
  console.error('DATABASE_URL non impostata: impossibile applicare le migrazioni.');
  process.exit(1);
}
const cartella =
  process.env.CARTELLA_MIGRAZIONI ??
  join(dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
const db = apriDatabase(config.databaseUrl);
try {
  const applicate = await applicaMigrazioni(db.pool, cartella);
  console.log(
    applicate.length > 0
      ? `Migrazioni applicate: ${applicate.join(', ')}`
      : 'Database già aggiornato: nessuna migrazione da applicare.',
  );
} finally {
  await db.chiudi();
}
