import { z } from 'zod';

/**
 * Configurazione letta dalle variabili d'ambiente (vedi .env.example).
 * Nessun segreto sta nel repository: se manca qualcosa il server non parte
 * e dice che cosa manca.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORTA: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url().optional(),
});

export type Config = {
  ambiente: 'development' | 'test' | 'production';
  porta: number;
  databaseUrl: string | undefined;
};

export function leggiConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const esito = schema.safeParse(env);
  if (!esito.success) {
    const problemi = esito.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Configurazione non valida — ${problemi}`);
  }
  const { NODE_ENV, PORTA, DATABASE_URL } = esito.data;
  if (NODE_ENV === 'production' && !DATABASE_URL) {
    throw new Error('Configurazione non valida — DATABASE_URL è obbligatoria in produzione');
  }
  return { ambiente: NODE_ENV, porta: PORTA, databaseUrl: DATABASE_URL };
}
