import { ALLERGENI, FRASE_FISSA, FRASE_NON_DICHIARATI, type Allergene } from './elenco.js';

/** Cosa dichiara il gestore su un ingrediente, per ogni allergene. */
export type Dichiarazione = 'contiene' | 'tracce' | 'non_contiene';

export type GlutineIngrediente =
  'contiene' | 'senza_per_natura' | 'senza_con_dicitura' | 'non_verificato';

export type Ingrediente = {
  id: string;
  nome: string;
  /** «verificato» solo dopo «Ho controllato l'etichetta»; ogni modifica lo riporta a «da_verificare». */
  stato: 'da_verificare' | 'verificato';
  /** Un allergene assente da questo elenco è «non dichiarato», mai «non contiene». */
  allergeni: Partial<Record<Allergene, Dichiarazione>>;
  glutine: GlutineIngrediente;
};

export type LavorazioneCondivisa = {
  zona: 'friggitrice' | 'forno' | 'piano_di_lavoro';
  /** allergeni presenti in quella zona: il piatto ne prende le tracce */
  allergeni: readonly Allergene[];
};

export type Piatto = {
  ingredienti: readonly Ingrediente[];
  /** aggiunte scelte dal cliente: portano i loro allergeni */
  aggiunte?: readonly Ingrediente[];
  /**
   * Ingredienti tolti dal cliente. Sono qui solo per chiarezza: NON cambiano
   * il risultato, perché togliere un ingrediente non toglie l'allergene.
   */
  tolti?: readonly string[];
  lavorazioniCondivise?: readonly LavorazioneCondivisa[];
  /** avviso generale del locale (es. «in cucina si usa farina»): tracce su tutti i piatti */
  avvisoGenerale?: readonly Allergene[];
  /** conferma del gestore «preparazione separata» per questo piatto */
  preparazioneSeparata?: boolean;
};

/**
 * Livello di un allergene sul piatto, dal più al meno prudente.
 * «non_dichiarato» sta sopra «tracce»: se manca un dato, il piatto potrebbe
 * anche contenerlo, quindi al cliente si dice di chiedere al personale.
 */
export type Livello = 'contiene' | 'non_dichiarato' | 'tracce' | 'non_contiene';

const PRUDENZA: Record<Livello, number> = {
  non_contiene: 0,
  tracce: 1,
  non_dichiarato: 2,
  contiene: 3,
};

export function piuPrudente(a: Livello, b: Livello): Livello {
  return PRUDENZA[a] >= PRUDENZA[b] ? a : b;
}

export function prudenza(livello: Livello): number {
  return PRUDENZA[livello];
}

/** Livello di un allergene su un singolo ingrediente. */
export function livelloIngrediente(ingrediente: Ingrediente, allergene: Allergene): Livello {
  // Un ingrediente da verificare vale «non dichiarato» per tutto, anche se ha delle spunte.
  if (ingrediente.stato !== 'verificato') return 'non_dichiarato';
  const dichiarato: Livello = ingrediente.allergeni[allergene] ?? 'non_dichiarato';
  if (allergene !== 'glutine') return dichiarato;
  // Per il glutine contano sia la spunta dell'allergene sia la scelta «Glutine» della scheda.
  const daScheda: Livello =
    ingrediente.glutine === 'contiene'
      ? 'contiene'
      : ingrediente.glutine === 'non_verificato'
        ? 'non_dichiarato'
        : 'non_contiene';
  return piuPrudente(dichiarato, daScheda);
}

/** Tutti gli ingredienti che contano: quelli del piatto (anche se tolti) più le aggiunte. */
function tuttiGliIngredienti(piatto: Piatto): Ingrediente[] {
  return [...piatto.ingredienti, ...(piatto.aggiunte ?? [])];
}

/** Passaggio ingrediente → piatto per i 14 allergeni. */
export function calcolaAllergeni(piatto: Piatto): Record<Allergene, Livello> {
  const ingredienti = tuttiGliIngredienti(piatto);
  const tracce = new Set<Allergene>([
    ...(piatto.avvisoGenerale ?? []),
    ...(piatto.lavorazioniCondivise ?? []).flatMap((l) => [...l.allergeni]),
  ]);
  const esito = {} as Record<Allergene, Livello>;
  for (const allergene of ALLERGENI) {
    // Un piatto senza ingredienti non ha dati: non dichiarato.
    let livello: Livello = ingredienti.length === 0 ? 'non_dichiarato' : 'non_contiene';
    for (const ingrediente of ingredienti) {
      livello = piuPrudente(livello, livelloIngrediente(ingrediente, allergene));
    }
    if (tracce.has(allergene)) livello = piuPrudente(livello, 'tracce');
    esito[allergene] = livello;
  }
  return esito;
}

export type EtichettaSenzaGlutine = {
  concessa: boolean;
  /** condizioni del §3 di docs/allergeni.md che non sono soddisfatte */
  mancano: string[];
};

/** L'etichetta «Senza glutine» non è una spunta libera: servono tutte e quattro le condizioni. */
export function etichettaSenzaGlutine(piatto: Piatto): EtichettaSenzaGlutine {
  const ingredienti = tuttiGliIngredienti(piatto);
  const mancano: string[] = [];
  if (ingredienti.length === 0) mancano.push('il piatto non ha ingredienti');

  const conGlutine = ingredienti.filter(
    (i) =>
      (i.glutine !== 'senza_per_natura' && i.glutine !== 'senza_con_dicitura') ||
      i.allergeni.glutine === 'contiene' ||
      i.allergeni.glutine === 'tracce',
  );
  if (conGlutine.length > 0) {
    mancano.push(
      `ingredienti non senza glutine per natura o con dicitura: ${conGlutine.map((i) => i.nome).join(', ')}`,
    );
  }
  const daVerificare = ingredienti.filter((i) => i.stato !== 'verificato');
  if (daVerificare.length > 0) {
    mancano.push(`ingredienti da verificare: ${daVerificare.map((i) => i.nome).join(', ')}`);
  }
  if ((piatto.lavorazioniCondivise ?? []).length > 0) mancano.push('lavorazione condivisa');
  if ((piatto.avvisoGenerale ?? []).length > 0) mancano.push('avviso generale del locale acceso');
  if (piatto.preparazioneSeparata !== true) {
    mancano.push('manca la conferma «preparazione separata»');
  }
  return { concessa: mancano.length === 0, mancano };
}

/**
 * Quello che può vedere il cliente. Di proposito non esiste un elenco
 * «non contiene»: il programma riporta solo ciò che è dichiarato.
 */
export type RiepilogoCliente = {
  contiene: Allergene[];
  tracce: Allergene[];
  /** true se manca anche un solo dato: va mostrata la frase «non dichiarati» */
  nonDichiarati: boolean;
  senzaGlutine: boolean;
  frasi: string[];
};

export function riepilogoPerCliente(piatto: Piatto): RiepilogoCliente {
  const livelli = calcolaAllergeni(piatto);
  const contiene = ALLERGENI.filter((a) => livelli[a] === 'contiene');
  const tracce = ALLERGENI.filter((a) => livelli[a] === 'tracce');
  // Basta una verifica mancante, anche se gli altri ingredienti dichiarano già tutto.
  const nonDichiarati =
    ALLERGENI.some((a) => livelli[a] === 'non_dichiarato') ||
    tuttiGliIngredienti(piatto).some((i) => i.stato !== 'verificato');
  const senzaGlutine = !nonDichiarati && etichettaSenzaGlutine(piatto).concessa;
  return {
    contiene,
    tracce,
    nonDichiarati,
    senzaGlutine,
    frasi: nonDichiarati ? [FRASE_NON_DICHIARATI, FRASE_FISSA] : [FRASE_FISSA],
  };
}
