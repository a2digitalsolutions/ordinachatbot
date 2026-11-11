import { describe, expect, it } from 'vitest';
import {
  formattaData,
  formattaDataBreve,
  formattaDataOra,
  formattaOra,
  formattaPrezzo,
} from '../src/index.js';

describe('formato italiano', () => {
  it('scrive i prezzi come «€ 8,50»', () => {
    expect(formattaPrezzo(850)).toBe('€ 8,50');
    expect(formattaPrezzo(0)).toBe('€ 0,00');
    expect(formattaPrezzo(5)).toBe('€ 0,05');
    expect(formattaPrezzo(123456)).toBe('€ 1.234,56');
    expect(formattaPrezzo(-250)).toBe('-€ 2,50');
  });

  it('rifiuta i prezzi non espressi in centesimi interi', () => {
    expect(() => formattaPrezzo(8.5)).toThrow(RangeError);
    expect(() => formattaPrezzo(Number.NaN)).toThrow(RangeError);
  });

  // 10 novembre 2026, 21:30 UTC = 22:30 in Italia (ora solare)
  const sera = new Date('2026-11-10T21:30:00Z');

  it('scrive le date per esteso e in breve', () => {
    expect(formattaData(sera)).toBe('martedì 10 novembre 2026');
    expect(formattaDataBreve(sera)).toBe('10/11/2026');
  });

  it("scrive l'ora su 24 ore con il fuso italiano", () => {
    expect(formattaOra(sera)).toBe('22:30');
    expect(formattaDataOra(sera)).toBe('10/11/2026 22:30');
  });

  it("usa il giorno italiano anche a cavallo della mezzanotte e con l'ora legale", () => {
    // 23:30 UTC del 10 novembre = 00:30 dell'11 in Italia
    expect(formattaDataBreve(new Date('2026-11-10T23:30:00Z'))).toBe('11/11/2026');
    // 15 luglio, ora legale: 20:15 UTC = 22:15 in Italia
    expect(formattaOra(new Date('2026-07-15T20:15:00Z'))).toBe('22:15');
  });
});
