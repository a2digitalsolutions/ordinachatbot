import { describe, expect, it } from 'vitest';
import { creaApp } from '../src/app.js';
import { leggiConfig } from '../src/config.js';

const config = leggiConfig({ NODE_ENV: 'test' });
const adesso = () => new Date('2026-11-10T21:30:00Z');

describe('GET /api/salute', () => {
  it('risponde ok e dice che il database non è configurato', async () => {
    const app = creaApp({ config, adesso });
    const r = await app.inject({ method: 'GET', url: '/api/salute' });
    expect(r.statusCode).toBe(200);
    expect(r.json()).toEqual({
      stato: 'ok',
      database: 'non_configurato',
      ambiente: 'test',
      ora: '10/11/2026 22:30',
    });
  });

  it('risponde ok quando il database risponde', async () => {
    const app = creaApp({ config, adesso, db: { risponde: async () => true } });
    const r = await app.inject({ method: 'GET', url: '/api/salute' });
    expect(r.statusCode).toBe(200);
    expect(r.json().database).toBe('ok');
  });

  it('risponde 503 quando il database non risponde', async () => {
    const app = creaApp({ config, adesso, db: { risponde: async () => false } });
    const r = await app.inject({ method: 'GET', url: '/api/salute' });
    expect(r.statusCode).toBe(503);
    expect(r.json()).toMatchObject({ stato: 'errore', database: 'non_risponde' });
  });
});
