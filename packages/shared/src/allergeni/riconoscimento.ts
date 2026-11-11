/**
 * Riconosce i messaggi che parlano di allergie, intolleranze o celiachia.
 *
 * È una regola scritta nel codice (non un'istruzione a un modello) e sbaglia
 * apposta dalla parte prudente: nel dubbio segnala. Ogni frase sfuggita va
 * aggiunta a docs/test/frasi-allergeni.md, che è la prova automatica.
 */

export type Argomenti = {
  allergeni: boolean;
  celiachia: boolean;
  motivi: string[];
};

const LEET: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
};

/** Caratteri invisibili (spazi a larghezza zero, trattino facoltativo) usati per spezzare le parole. */
const INVISIBILI = new RegExp(
  `[${[0x200b, 0x200c, 0x200d, 0x2060, 0xfeff, 0x00ad].map((c) => String.fromCharCode(c)).join('')}]`,
  'g',
);

/** Minuscole, senza accenti, senza trucchi (cifre al posto delle lettere, lettere staccate). */
export function normalizza(testo: string): string {
  let s = testo.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(INVISIBILI, '');
  // cifre e simboli usati come lettere, solo dentro una parola: «glut1ne», «all3rgia»
  s = s.replace(/(?<=[a-z])[013457@$]+(?=[a-z])/g, (m) => [...m].map((c) => LEET[c] ?? c).join(''));
  s = s.replace(/[^a-z0-9]+/g, ' ').trim();
  // lettere ripetute: «alllergia» → «allergia»
  s = s.replace(/([a-z])\1{2,}/g, '$1$1');
  // lettere staccate: «g l u t i n e» → «glutine»
  s = s.replace(/\b(?:[a-z] ){3,}[a-z]\b/g, (m) => m.replace(/ /g, ''));
  return s;
}

const RADICI_CELIACHIA = ['celiac', 'celiach', 'coeliac', 'ciliac', 'glutin', 'gluten'];
const RADICI_ALLERGENI = [
  'allerg',
  'alerg',
  'intolleran',
  'intoleran',
  'intolerant',
  'lattosio',
  'lactose',
  'anafila',
  'anaphyl',
  'epipen',
  'favism',
  'nichel',
  'istamin',
  'antistaminic',
];

/** Parole intere confrontate «a orecchio», per gli errori di battitura. */
const PAROLE_CELIACHIA = ['celiaco', 'celiaca', 'celiaci', 'celiachia', 'glutine'];
const PAROLE_ALLERGENI = [
  'allergia',
  'allergie',
  'allergico',
  'allergica',
  'allergici',
  'allergeni',
  'allergene',
  'allergy',
  'allergic',
  'intollerante',
  'intolleranti',
  'intolleranza',
  'intolleranze',
  'lattosio',
];

/** Alimenti delle 14 famiglie, come li scrive un cliente. */
const FAMIGLIA_GLUTINE =
  'farin[ae]|grano|frumento|orzo|segale|farro|avena|kamut|wheat|flour|pane|pasta';
const FAMIGLIE_ALTRE =
  'crostace[io]|gamber\\w*|scamp[io]|aragost\\w*|granchi\\w*|uov[ao]|eggs?|pesce|fish|arachid[ei]|noccioline|peanuts?|soia|soy|latte|latticini|milk|dairy|frutta a guscio|frutta secca|noc[ei]|nocciol[ae]|mandorl[ae]|pistacch[io]|anacard[io]|nuts?|sedano|senape|sesamo|solfiti|anidride solforosa|lupini|mollusch[io]|cozze|vongole|calamar[io]|polpo|seppi[ae]';
const RE_FAMIGLIA_GLUTINE = new RegExp(`\\b(?:${FAMIGLIA_GLUTINE})\\b`);
const RE_FAMIGLIA = new RegExp(`\\b(?:${FAMIGLIA_GLUTINE}|${FAMIGLIE_ALTRE})\\b`);

/** Frasi che parlano di salute senza nominare allergie: «non può mangiare…», «mi gonfio…». */
const SALUTE: RegExp[] = [
  /\bnon (?:puo|posso|possiamo|possono|puoi|potrei|potrebbe|riesco a|riesce a) (?:piu )?(?:mangiare|bere|assumere|prendere|toccare|digerire)\b(?! (?:qui|qua|adesso|ora|subito|tutto|tanto|troppo|molto|di piu|altro|fuori|in piedi|da sol[oa])\b)/,
  /\b(?:nun|non|un|unn) (?:pozzu|pozzo|po|pote|ponnu|pozz) (?:mancia|magna|mangia)\w*/,
  /\b(?:mi|gli|le|ci|ti|vi) (?:fa|fanno) (?:male|gonfiare|stare male|venire)\b/,
  /\bfa(?:nno)? male (?:a|al|alla|ai) /,
  /\bmi gonfi/,
  /\b(?:mi|gli|le|ci|ti|vi) (?:da|danno|crea|creano|porta|portano) (?:dei |qualche )?(?:problem[ai]|fastidi[o]?|noia|disturb[io])\b/,
  /\bmal di (?:pancia|stomaco|testa|gola)\b/,
  /\b(?:vomit\w*|nausea|diarrea|crampi|bruciore|bruciori|gonfia\w*|si gonfia|soffoc\w*)\b/,
  /\b(?:sto|sta|stiamo|stanno|stare) male\b(?! (?:dal|dalle|per le|a forza di) ri[ds])/,
  /\bnon (?:digerisco|digerisce|tollero|tollera|sopporto|sopporta)\b/,
  /\b(?:reazione|reazioni|orticaria|prurito|sfogo|gonfiore|eruzione|rash|hives|shock anafilattico)\b/,
  /\b(?:can t|cant|cannot|can not) (?:eat|have|drink|tolerate)\b/,
  /\bmakes? (?:me|him|her) (?:sick|ill)\b/,
];

/** Domande sulla presenza di un alimento delle 14 famiglie in un piatto. */
const RE_PRESENZA = new RegExp(
  `\\b(?:contien[ei]|contengono|contenere|tracce|traccia|presenza|contains?)\\b.*\\b(?:${FAMIGLIA_GLUTINE}|${FAMIGLIE_ALTRE})\\b`,
);
const RE_PRESENZA_DENTRO = new RegExp(
  `\\b(?:c e|ci sono|ce|ci sta|ci stanno|is there|are there)\\b.*\\b(?:${FAMIGLIA_GLUTINE}|${FAMIGLIE_ALTRE})\\b.*\\b(?:nel|nella|nello|nell|nei|negli|nelle|dentro|in|sul|sulla)\\b`,
);

/** «la pizza ha il latte?», «cosa non ha latticini», «questo ha le noci dentro?» */
const RE_PRESENZA_HA = new RegExp(
  `\\b(?:ha|hanno)\\b (?:\\w+ ){0,2}(?:${FAMIGLIA_GLUTINE}|${FAMIGLIE_ALTRE})\\b`,
);
/** «ho problemi con le uova», «problemi col latte»: un problema più un alimento delle 14 famiglie. */
const RE_PROBLEMI = /\b(?:problem[ai]|fastidi[o]?|disturb[io])\b/;

/** Distanza tra due parole (inserimenti, cancellazioni, sostituzioni, scambi di lettere vicine). */
export function distanza(a: string, b: string): number {
  const righe = a.length + 1;
  const colonne = b.length + 1;
  const d: number[][] = Array.from({ length: righe }, () => new Array<number>(colonne).fill(0));
  for (let i = 0; i < righe; i++) d[i]![0] = i;
  for (let j = 0; j < colonne; j++) d[0]![j] = j;
  for (let i = 1; i < righe; i++) {
    for (let j = 1; j < colonne; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + costo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, d[i - 2]![j - 2]! + 1);
      }
      d[i]![j] = v;
    }
  }
  return d[a.length]![b.length]!;
}

function somiglia(parola: string, elenco: readonly string[]): string | undefined {
  if (parola.length < 6) return undefined;
  return elenco.find((modello) => {
    const tolleranza = modello.length >= 9 ? 2 : 1;
    return (
      Math.abs(parola.length - modello.length) <= tolleranza &&
      distanza(parola, modello) <= tolleranza
    );
  });
}

export function riconosci(testo: string): Argomenti {
  const s = normalizza(testo);
  const parole = s.split(' ').filter(Boolean);
  const compatto = parole.join('');
  const motivi: string[] = [];
  let allergeni = false;
  let celiachia = false;

  for (const radice of RADICI_CELIACHIA) {
    if (compatto.includes(radice)) {
      celiachia = true;
      motivi.push(`parola: ${radice}`);
    }
  }
  for (const radice of RADICI_ALLERGENI) {
    if (compatto.includes(radice)) {
      allergeni = true;
      motivi.push(`parola: ${radice}`);
    }
  }
  for (const parola of parole) {
    const c = somiglia(parola, PAROLE_CELIACHIA);
    if (c) {
      celiachia = true;
      motivi.push(`simile a: ${c}`);
    }
    const a = somiglia(parola, PAROLE_ALLERGENI);
    if (a) {
      allergeni = true;
      motivi.push(`simile a: ${a}`);
    }
  }
  if (/\b(?:gluten|lactose|dairy|nut|wheat) free\b/.test(s)) {
    allergeni = true;
    motivi.push('free from');
  }
  if (/\b(?:gluten|wheat) free\b/.test(s)) celiachia = true;

  const salute = SALUTE.some((re) => re.test(s));
  const presenza =
    RE_PRESENZA.test(s) ||
    RE_PRESENZA_DENTRO.test(s) ||
    RE_PRESENZA_HA.test(s) ||
    (RE_PROBLEMI.test(s) && RE_FAMIGLIA.test(s));
  if (salute || presenza) {
    allergeni = true;
    motivi.push(salute ? 'frase sulla salute' : 'domanda sulla presenza di un allergene');
    // se si parla di farina, grano, pane… può essere celiachia: vale per tutti e due
    if (RE_FAMIGLIA_GLUTINE.test(s)) celiachia = true;
  }
  return { allergeni, celiachia, motivi };
}

/** true se nel testo compare un alimento delle 14 famiglie. */
export function nominaFamigliaAllergeni(testo: string): boolean {
  return RE_FAMIGLIA.test(normalizza(testo));
}

const AFFERMAZIONI_FORTI: RegExp[] = [
  new RegExp(
    `\\b(?:non contien[ei]|non contengono|priv[oaie] di|senza|nessun[ao]?|non c e|non ci sono|non ha|non hanno|free from|no)\\b (?:\\w+ ){0,2}(?:${FAMIGLIA_GLUTINE}|${FAMIGLIE_ALTRE}|glutine|lattosio|allergen[ei])\\b`,
  ),
  /\b(?:gluten|lactose|dairy|nut|wheat) free\b/,
  /\bpuoi (?:mangiar|ber|prender|ordinar)l[oaie]\b/,
  /\bpuo (?:mangiar|ber|prender|ordinar)l[oaie]\b/,
  /\b(?:puoi|puo|potete) stare tranquill/,
];
const AFFERMAZIONI_GENERICHE =
  /\b(?:sicur[oaie]|adatt[oaie]|idone[oaie]|tranquill[oaie]|garantit[oaie]|safe|suitable|va bene per)\b/;

/**
 * true se il testo afferma qualcosa su allergeni o glutine («non contiene»,
 * «è sicuro», «adatto ai celiaci», «puoi mangiarlo»…). Il programma queste
 * frasi non le dice mai di sua iniziativa.
 */
export function contieneAffermazione(testo: string): boolean {
  const s = normalizza(testo);
  if (AFFERMAZIONI_FORTI.some((re) => re.test(s))) return true;
  if (!AFFERMAZIONI_GENERICHE.test(s)) return false;
  const argomenti = riconosci(testo);
  return argomenti.allergeni || argomenti.celiachia || RE_FAMIGLIA.test(s);
}
