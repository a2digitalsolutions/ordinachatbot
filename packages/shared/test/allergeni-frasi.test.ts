import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { controllaMessaggio, riconosci, segnalazioneAllergia } from '../src/index.js';

const radice = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

/** Legge docs/test/frasi-allergeni.md: una frase per riga, divise per sezione. */
function leggiFrasi(): Record<string, string[]> {
  const sezioni: Record<string, string[]> = {};
  let corrente = '';
  for (const riga of readFileSync(join(radice, 'docs/test/frasi-allergeni.md'), 'utf8').split(
    '\n',
  )) {
    if (riga.startsWith('## ')) corrente = riga.slice(3).trim();
    else if (riga.startsWith('- ') && corrente)
      (sezioni[corrente] ??= []).push(riga.slice(2).trim());
  }
  return sezioni;
}

const frasi = leggiFrasi();
const celiachia = frasi['Da bloccare — celiachia'] ?? [];
const allergeni = frasi['Da bloccare — allergeni'] ?? [];
const aggiramenti = frasi['Tentativi di aggirare il blocco'] ?? [];
const innocenti = frasi['Innocenti (non vanno bloccate)'] ?? [];

/** Simula i messaggi mandati uno dopo l'altro: basta che uno venga bloccato. */
function bloccata(frase: string, impostazione: 'tutti_e_due' | 'allergeni' | 'celiachia') {
  const messaggi = frase.split(' || ');
  return messaggi.some(
    (m, i) => controllaMessaggio(m, impostazione, messaggi.slice(0, i)).bloccato,
  );
}

describe('frasi di docs/test/frasi-allergeni.md', () => {
  it('il file contiene tutte le sezioni, con abbastanza frasi', () => {
    expect(celiachia.length).toBeGreaterThanOrEqual(50);
    expect(allergeni.length).toBeGreaterThanOrEqual(70);
    expect(aggiramenti.length).toBeGreaterThanOrEqual(20);
    expect(innocenti.length).toBeGreaterThanOrEqual(60);
  });

  it.each(celiachia)('celiachia, bloccata: %s', (frase) => {
    expect(riconosci(frase).celiachia).toBe(true);
    expect(bloccata(frase, 'tutti_e_due')).toBe(true);
    expect(bloccata(frase, 'celiachia')).toBe(true);
  });

  it.each(allergeni)('allergeni, bloccata: %s', (frase) => {
    expect(riconosci(frase).allergeni).toBe(true);
    expect(bloccata(frase, 'tutti_e_due')).toBe(true);
    expect(bloccata(frase, 'allergeni')).toBe(true);
  });

  it.each(aggiramenti)('aggiramento, bloccato: %s', (frase) => {
    expect(bloccata(frase, 'tutti_e_due')).toBe(true);
  });

  it.each(innocenti)('innocente, non bloccata: %s', (frase) => {
    expect(bloccata(frase, 'tutti_e_due')).toBe(false);
    expect(segnalazioneAllergia(frase).segnalata).toBe(false);
  });

  it('ogni frase da bloccare fa uscire la riga di attenzione sulla comanda', () => {
    for (const frase of [...celiachia, ...allergeni]) {
      expect(segnalazioneAllergia(frase).segnalata, frase).toBe(true);
    }
  });
});

// Le 512 frasi della demo: quelle che la demo blocca devono essere bloccate anche qui,
// e nessuna delle altre deve esserlo.
const fileDemo = join(radice, 'demo/prove-domande.mjs');
describe.skipIf(!existsSync(fileDemo))('frasi della demo', () => {
  const righe = existsSync(fileDemo) ? readFileSync(fileDemo, 'utf8').split('\n') : [];
  const prove = righe
    .map((r) => /^\s*\["((?:[^"\\]|\\.)*)",\s*"([a-z_]+)"/.exec(r))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ frase: JSON.parse(`"${m[1]}"`) as string, tipo: m[2]! }));

  it('la demo ha le sue prove', () => {
    expect(prove.length).toBeGreaterThan(400);
  });

  it('stesso esito della demo su ogni frase', () => {
    const diverse = prove
      .filter((p) => controllaMessaggio(p.frase, 'tutti_e_due').bloccato !== (p.tipo === 'blocked'))
      .map((p) => `${p.tipo}: ${p.frase}`);
    expect(diverse).toEqual([]);
  });
});
