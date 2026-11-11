import { creaApp } from './app.js';
import { leggiConfig } from './config.js';
import { apriDatabase } from './db.js';

const config = leggiConfig();
const db = config.databaseUrl ? apriDatabase(config.databaseUrl) : undefined;
const app = creaApp(db ? { config, db } : { config });

const chiudi = async () => {
  await app.close();
  await db?.chiudi();
  process.exit(0);
};
process.on('SIGTERM', () => void chiudi());
process.on('SIGINT', () => void chiudi());

await app.listen({ port: config.porta, host: '0.0.0.0' });
console.log(`Ordinachatbot: server in ascolto sulla porta ${config.porta}`);
