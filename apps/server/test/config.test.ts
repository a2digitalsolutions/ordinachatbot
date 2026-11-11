import { describe, expect, it } from 'vitest';
import { leggiConfig } from '../src/config.js';

describe('configurazione', () => {
  it('usa valori predefiniti in sviluppo', () => {
    expect(leggiConfig({})).toEqual({
      ambiente: 'development',
      porta: 3000,
      databaseUrl: undefined,
    });
  });

  it('legge porta e database', () => {
    const c = leggiConfig({ PORTA: '8080', DATABASE_URL: 'postgres://u:p@db:5432/oc' });
    expect(c.porta).toBe(8080);
    expect(c.databaseUrl).toBe('postgres://u:p@db:5432/oc');
  });

  it('rifiuta una porta non valida', () => {
    expect(() => leggiConfig({ PORTA: 'abc' })).toThrow(/Configurazione non valida/);
  });

  it('in produzione pretende il database', () => {
    expect(() => leggiConfig({ NODE_ENV: 'production' })).toThrow(/DATABASE_URL/);
  });
});
