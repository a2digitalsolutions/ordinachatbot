import Fastify, { type FastifyInstance } from 'fastify';
import { formattaDataOra } from '@ordinachatbot/shared';
import type { Config } from './config.js';
import type { Database } from './db.js';

export type Dipendenze = {
  config: Config;
  /** assente solo in sviluppo e nelle prove senza database */
  db?: Pick<Database, 'risponde'>;
  adesso?: () => Date;
};

export function creaApp({ config, db, adesso = () => new Date() }: Dipendenze): FastifyInstance {
  const app = Fastify({ logger: config.ambiente === 'production' });

  // Controllo del servizio: usato da Docker, dalla CI e dal monitoraggio.
  app.get('/api/salute', async (_richiesta, risposta) => {
    const database = db ? ((await db.risponde()) ? 'ok' : 'non_risponde') : 'non_configurato';
    const stato = database === 'non_risponde' ? 'errore' : 'ok';
    return risposta.code(stato === 'ok' ? 200 : 503).send({
      stato,
      database,
      ambiente: config.ambiente,
      ora: formattaDataOra(adesso()),
    });
  });

  return app;
}
