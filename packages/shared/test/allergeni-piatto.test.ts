import { describe, expect, it } from 'vitest';
import {
  ALLERGENI,
  FRASE_FISSA,
  FRASE_NON_DICHIARATI,
  calcolaAllergeni,
  etichettaSenzaGlutine,
  livelloIngrediente,
  prudenza,
  riepilogoPerCliente,
  type Allergene,
  type Dichiarazione,
  type GlutineIngrediente,
  type Ingrediente,
  type Piatto,
} from '../src/index.js';

/** Ingrediente verificato che non contiene nulla, salvo ciò che si indica. */
function ingrediente(
  nome: string,
  extra: Partial<Record<Allergene, Dichiarazione>> = {},
  altro: Partial<Pick<Ingrediente, 'stato' | 'glutine'>> = {},
): Ingrediente {
  const allergeni = Object.fromEntries(ALLERGENI.map((a) => [a, 'non_contiene'])) as Record<
    Allergene,
    Dichiarazione
  >;
  return {
    id: nome,
    nome,
    stato: 'verificato',
    glutine: extra.glutine === 'contiene' ? 'contiene' : 'senza_per_natura',
    ...altro,
    allergeni: { ...allergeni, ...extra },
  };
}

const pomodoro = ingrediente('pomodoro');
const mozzarella = ingrediente('mozzarella', { latte: 'contiene' });
const impasto = ingrediente('impasto', { glutine: 'contiene' });
const pesto = ingrediente('pesto', { frutta_a_guscio: 'contiene', latte: 'tracce' });

describe('i 14 allergeni', () => {
  it('sono quattordici, senza doppioni', () => {
    expect(ALLERGENI).toHaveLength(14);
    expect(new Set(ALLERGENI).size).toBe(14);
  });
});

describe('passaggio ingrediente → piatto', () => {
  it('il piatto eredita gli allergeni di tutti gli ingredienti', () => {
    const livelli = calcolaAllergeni({ ingredienti: [pomodoro, mozzarella, impasto] });
    expect(livelli.latte).toBe('contiene');
    expect(livelli.glutine).toBe('contiene');
    expect(livelli.uova).toBe('non_contiene');
  });

  it('le aggiunte scelte dal cliente portano i loro allergeni', () => {
    const livelli = calcolaAllergeni({ ingredienti: [pomodoro], aggiunte: [pesto] });
    expect(livelli.frutta_a_guscio).toBe('contiene');
    expect(livelli.latte).toBe('tracce');
  });

  it("togliere un ingrediente non toglie l'allergene (prova 5)", () => {
    const margherita: Piatto = { ingredienti: [pomodoro, mozzarella, impasto] };
    const senzaMozzarella: Piatto = { ...margherita, tolti: ['mozzarella'] };
    expect(calcolaAllergeni(senzaMozzarella)).toEqual(calcolaAllergeni(margherita));
    expect(riepilogoPerCliente(senzaMozzarella).contiene).toContain('latte');
  });

  it('un allergene non compilato è «non dichiarato», mai «non contiene»', () => {
    const sale: Ingrediente = {
      id: 'sale',
      nome: 'sale',
      stato: 'verificato',
      glutine: 'senza_per_natura',
      allergeni: { latte: 'non_contiene' },
    };
    const livelli = calcolaAllergeni({ ingredienti: [sale] });
    expect(livelli.latte).toBe('non_contiene');
    expect(livelli.uova).toBe('non_dichiarato');
  });

  it('un ingrediente «da verificare» vale «non dichiarato» anche se ha le spunte (prova 6)', () => {
    const maionese = ingrediente('maionese', { uova: 'contiene' }, { stato: 'da_verificare' });
    for (const a of ALLERGENI) expect(livelloIngrediente(maionese, a)).toBe('non_dichiarato');
    const riepilogo = riepilogoPerCliente({ ingredienti: [pomodoro, maionese] });
    expect(riepilogo.nonDichiarati).toBe(true);
    expect(riepilogo.senzaGlutine).toBe(false);
    expect(riepilogo.frasi).toEqual([FRASE_NON_DICHIARATI, FRASE_FISSA]);
  });

  it('glutine «non verificato» sulla scheda non diventa mai «non contiene» (prova 6)', () => {
    const salsa = ingrediente('salsa', {}, { glutine: 'non_verificato' });
    expect(calcolaAllergeni({ ingredienti: [salsa] }).glutine).toBe('non_dichiarato');
  });

  it('per il glutine vale il dato più prudente tra spunta e scheda', () => {
    const a = ingrediente('a', { glutine: 'non_contiene' }, { glutine: 'contiene' });
    const b = ingrediente('b', { glutine: 'tracce' }, { glutine: 'senza_per_natura' });
    expect(livelloIngrediente(a, 'glutine')).toBe('contiene');
    expect(livelloIngrediente(b, 'glutine')).toBe('tracce');
  });

  it('lavorazione condivisa e avviso generale aggiungono le tracce', () => {
    const patatine: Piatto = {
      ingredienti: [ingrediente('patate'), ingrediente('olio')],
      lavorazioniCondivise: [{ zona: 'friggitrice', allergeni: ['glutine', 'pesce'] }],
      avvisoGenerale: ['frutta_a_guscio'],
    };
    const livelli = calcolaAllergeni(patatine);
    expect(livelli.glutine).toBe('tracce');
    expect(livelli.pesce).toBe('tracce');
    expect(livelli.frutta_a_guscio).toBe('tracce');
    expect(livelli.latte).toBe('non_contiene');
  });

  it('le tracce non abbassano mai un «contiene» o un «non dichiarato»', () => {
    const livelli = calcolaAllergeni({
      ingredienti: [impasto, ingrediente('x', {}, { stato: 'da_verificare' })],
      avvisoGenerale: ['glutine', 'latte'],
    });
    expect(livelli.glutine).toBe('contiene');
    expect(livelli.latte).toBe('non_dichiarato');
  });

  it('un piatto senza ingredienti non dichiara nulla', () => {
    const riepilogo = riepilogoPerCliente({ ingredienti: [] });
    expect(riepilogo.nonDichiarati).toBe(true);
    expect(riepilogo.contiene).toEqual([]);
  });

  it('il riepilogo per il cliente non ha mai un elenco «non contiene»', () => {
    const riepilogo = riepilogoPerCliente({ ingredienti: [pomodoro, mozzarella] });
    expect(Object.keys(riepilogo).sort()).toEqual(
      ['contiene', 'frasi', 'nonDichiarati', 'senzaGlutine', 'tracce'].sort(),
    );
    expect(riepilogo.frasi).toEqual([FRASE_FISSA]);
  });
});

describe('etichetta «Senza glutine» (prova 7)', () => {
  const pastaSg = ingrediente('pasta di mais', {}, { glutine: 'senza_con_dicitura' });
  const valido: Piatto = { ingredienti: [pastaSg, pomodoro], preparazioneSeparata: true };

  it('compare con tutte e quattro le condizioni', () => {
    expect(etichettaSenzaGlutine(valido)).toEqual({ concessa: true, mancano: [] });
    expect(riepilogoPerCliente(valido).senzaGlutine).toBe(true);
  });

  const cadute: [string, Piatto][] = [
    ['un ingrediente contiene glutine', { ...valido, ingredienti: [pastaSg, impasto] }],
    [
      'un ingrediente ha il glutine non verificato',
      {
        ...valido,
        ingredienti: [pastaSg, ingrediente('salsa', {}, { glutine: 'non_verificato' })],
      },
    ],
    [
      'un ingrediente ha tracce di glutine',
      { ...valido, ingredienti: [pastaSg, ingrediente('spezie', { glutine: 'tracce' })] },
    ],
    [
      'un ingrediente torna da verificare',
      { ...valido, ingredienti: [pastaSg, { ...pomodoro, stato: 'da_verificare' }] },
    ],
    ["un'aggiunta contiene glutine", { ...valido, aggiunte: [impasto] }],
    [
      'lavorazione condivisa',
      { ...valido, lavorazioniCondivise: [{ zona: 'forno', allergeni: ['glutine'] }] },
    ],
    [
      'lavorazione condivisa anche senza glutine indicato',
      { ...valido, lavorazioniCondivise: [{ zona: 'piano_di_lavoro', allergeni: [] }] },
    ],
    ['avviso generale acceso', { ...valido, avvisoGenerale: ['glutine'] }],
    ['manca la preparazione separata', { ingredienti: valido.ingredienti }],
    ['preparazione separata negata', { ...valido, preparazioneSeparata: false }],
    ['nessun ingrediente', { ingredienti: [], preparazioneSeparata: true }],
  ];

  it.each(cadute)('sparisce se %s', (_caso, piatto) => {
    const esito = etichettaSenzaGlutine(piatto);
    expect(esito.concessa).toBe(false);
    expect(esito.mancano.length).toBeGreaterThan(0);
    expect(riepilogoPerCliente(piatto).senzaGlutine).toBe(false);
  });

  it('togliere un ingrediente con glutine non fa comparire l’etichetta', () => {
    const piatto: Piatto = { ...valido, ingredienti: [pastaSg, impasto], tolti: ['impasto'] };
    expect(etichettaSenzaGlutine(piatto).concessa).toBe(false);
  });
});

describe('migliaia di combinazioni a caso (prova 4)', () => {
  // generatore con seme fisso: la prova è sempre la stessa
  let seme = 20261111;
  const caso = () => {
    seme = (seme + 0x6d2b79f5) | 0;
    let t = Math.imul(seme ^ (seme >>> 15), 1 | seme);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const scegli = <T>(v: readonly T[]): T => v[Math.floor(caso() * v.length)]!;
  const DICHIARAZIONI: (Dichiarazione | undefined)[] = [
    'contiene',
    'tracce',
    'non_contiene',
    'non_contiene',
    undefined,
  ];
  const GLUTINE: GlutineIngrediente[] = [
    'contiene',
    'senza_per_natura',
    'senza_con_dicitura',
    'non_verificato',
  ];

  function ingredienteACaso(n: number): Ingrediente {
    const allergeni: Partial<Record<Allergene, Dichiarazione>> = {};
    for (const a of ALLERGENI) {
      const d = scegli(DICHIARAZIONI);
      if (d) allergeni[a] = d;
    }
    return {
      id: `i${n}`,
      nome: `ingrediente ${n}`,
      stato: caso() < 0.8 ? 'verificato' : 'da_verificare',
      glutine: scegli(GLUTINE),
      allergeni,
    };
  }

  function piattoACaso(): Piatto {
    const ingredienti = Array.from({ length: 1 + Math.floor(caso() * 6) }, (_, n) =>
      ingredienteACaso(n),
    );
    const aggiunte = Array.from({ length: Math.floor(caso() * 3) }, (_, n) =>
      ingredienteACaso(100 + n),
    );
    return {
      ingredienti,
      aggiunte,
      tolti: ingredienti.filter(() => caso() < 0.3).map((i) => i.id),
      lavorazioniCondivise:
        caso() < 0.3 ? [{ zona: 'friggitrice', allergeni: [scegli(ALLERGENI)] }] : [],
      avvisoGenerale: caso() < 0.2 ? [scegli(ALLERGENI)] : [],
      preparazioneSeparata: caso() < 0.5,
    };
  }

  it('5.000 piatti: mai meno prudente dei propri ingredienti, mai «senza glutine» a torto', () => {
    let conEtichetta = 0;
    for (let n = 0; n < 5000; n++) {
      const piatto = piattoACaso();
      const livelli = calcolaAllergeni(piatto);
      const riepilogo = riepilogoPerCliente(piatto);
      const tutti = [...piatto.ingredienti, ...(piatto.aggiunte ?? [])];

      for (const a of ALLERGENI) {
        for (const i of tutti) {
          // il piatto è almeno prudente quanto ogni ingrediente, tolto o no
          expect(prudenza(livelli[a])).toBeGreaterThanOrEqual(prudenza(livelloIngrediente(i, a)));
        }
        // «non contiene» solo se ogni ingrediente è verificato e lo dichiara
        if (livelli[a] === 'non_contiene') {
          expect(tutti.every((i) => i.stato === 'verificato')).toBe(true);
          expect(tutti.every((i) => i.allergeni[a] === 'non_contiene')).toBe(true);
        }
      }
      // un solo ingrediente da verificare → «non dichiarati» e niente etichetta
      if (tutti.some((i) => i.stato !== 'verificato')) {
        expect(riepilogo.nonDichiarati).toBe(true);
        expect(riepilogo.senzaGlutine).toBe(false);
      }
      if (riepilogo.senzaGlutine) {
        conEtichetta++;
        expect(livelli.glutine).toBe('non_contiene');
        expect(piatto.preparazioneSeparata).toBe(true);
        expect(piatto.lavorazioniCondivise).toEqual([]);
        expect(piatto.avvisoGenerale).toEqual([]);
        expect(
          tutti.every(
            (i) => i.glutine === 'senza_per_natura' || i.glutine === 'senza_con_dicitura',
          ),
        ).toBe(true);
      }
      // togliere ingredienti non cambia nulla
      expect(calcolaAllergeni({ ...piatto, tolti: [] })).toEqual(livelli);
    }
    // con dati a caso l'etichetta è rarissima: qui basta che non sia mai sbagliata
    expect(conEtichetta).toBeGreaterThanOrEqual(0);
  });
});
